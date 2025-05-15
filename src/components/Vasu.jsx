import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquarePlus } from 'lucide-react'; // At the top of your component

function Vasu() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [allConversations, setAllConversations] = useState([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);

  // Generate userId on first render
  useEffect(() => {
    const id = uuidv4();
    setUserId(id);
  }, []);

  // Fetch existing conversations from backend
  const fetchConversations = async (id) => {
    try {
      if (id === "null") {
        const response = await fetch(`http://192.168.1.102:3001/vasu/conversations`);
        const data = await response.json();
        if (Array.isArray(data.userIds)) {
          setAllConversations(data.userIds);
        }
      }
      else {
        const response = await fetch(`http://192.168.1.102:3001/vasu/conversations?id=${id}`);
        const data = await response.json();
        setMessages(data.conversation)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConversations("null");
    }
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.102:3001/vasu/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, userId }),
      });

      const data = await response.json();
      const { summary, isCode } = data;

      const newAssistantMessage = {
        text: summary,
        isUser: false,
        isCode: isCode || false,
      };

      const updatedMessages = [...newMessages, newAssistantMessage];
      setMessages(updatedMessages);
      fetchConversations("null"); // Refresh chat list
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { text: "Sorry, something went wrong.", isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    const id = uuidv4();
    setUserId(id)
  };

  const callSelectedUserConversation = async (id) => {
    fetchConversations(id);
    setUserId(id)
  }

  return (
    <div style={{ backgroundColor: '#fff', width: '100vw', height: '100vh' }}>
      <div className="grid grid-cols-5 grid-rows-5 gap-4" style={{ height: '100%' }}>
        <div className="row-span-5 bg-white p-2 border-blue-200">
          <button
            className="mb-4 p-2 rounded cursor-pointer flex items-center justify-center gap-2"
            onClick={startNewChat}
            title='New Chat'
          >
            <MessageSquarePlus color='#c39297' size={18} />
          </button>

          <h6 className="text-lg mb-2" style={{color: "#ccc"}}>Conversations</h6>
          <div className="space-y-2 overflow-y-auto max-h-[80vh]">
            {allConversations.length > 0 ? allConversations.map((e, index) => (
              <div
                key={e}
                title={e}
                className={`p-1 rounded cursor-pointer ${userId === e ? 'bg-blue-200' : 'bg-gray-200'}`}
                onClick={() => callSelectedUserConversation(e)}
              >
                <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{e}</p>
              </div>
            )) : <p>No Conversations</p>}
          </div>
        </div>
        <div className="col-span-4 row-span-5" style={{ height: '100%' }}>
          <div className="p-2 flex flex-col justify-between gap-2" style={{ height: '100%' }}>
            <div className="col-span-5 row-span-4" style={{ overflowY: "scroll" }}>
              <div className='space-y-4'>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg ${msg.isUser
                        ? 'max-w-xs bg-blue-200 text-black'
                        : 'bg-white text-black'
                        }`}
                    >
                      {msg.isCode ? (
                        <pre className="bg-gray-200 p-4 rounded-md overflow-auto">
                          <code>{Array.isArray(msg.text) ? msg.text.map((e) => e?.text || e).join('\n') : msg.text}</code>
                        </pre>
                      ) : (
                        Array.isArray(msg.text) ? (
                          msg.text.map((e, idx) => (
                            <p key={idx}>{(e?.text || e)?.split('\n').map((line, i) => <div key={i}>{line}</div>)}</p>
                          ))
                        ) : (
                          typeof msg.text === 'string'
                            ? msg.text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)
                            : msg.text
                        )
                      )}

                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs p-3 rounded-lg bg-gray-300 text-black">...</div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2 col-span-5 row-start-5 bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-blue-200 text-black rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Vasu;