import { useState } from 'react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { Send } from 'lucide-react';

const AgentChatInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, loading } = useChatContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={loading}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </form>
  );
};

export default AgentChatInput;
