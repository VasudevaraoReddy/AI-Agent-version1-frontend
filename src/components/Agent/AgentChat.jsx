import { useEffect, useRef } from 'react';
import { useChatContext } from '../../context/ChatContext.jsx';
import { Cloud, Database, Server } from 'lucide-react';
import AgentChatMessage from './AgentChatMessage.jsx';
import AgentChatInput from './AgentChatInput.jsx';

const AgentChat = () => {
  const { chatHistory, currentUser, currentCSP, loading } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const getCSPDetails = () => {
    switch (currentCSP) {
      case 'aws':
        return { color: 'bg-yellow-600', name: 'AWS', icon: <Cloud className="h-4 w-4 mr-1" /> };
      case 'azure':
        return { color: 'bg-blue-700', name: 'Azure', icon: <Database className="h-4 w-4 mr-1" /> };
      case 'gcp':
        return { color: 'bg-red-600', name: 'GCP', icon: <Server className="h-4 w-4 mr-1" /> };
      default:
        return { color: 'bg-gray-500', name: currentCSP || 'Unknown', icon: <Cloud className="h-4 w-4 mr-1" /> };
    }
  };

  const cspDetails = getCSPDetails();
  const messages = chatHistory?.history || [];

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500 text-sm">Select a conversation to <button className='cursor-pointer underline'>Start</button></p> 
        
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-800">Conversation with {currentUser}</h2>
        <div className={`text-white flex items-center px-3 py-1 rounded-full ${cspDetails.color}`}>
          {cspDetails.icon}
          <span className="text-sm">{cspDetails.name}</span>
        </div>
      </div>


      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {loading && messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No messages yet</p>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isUser = msg[0] === 'human';
              const content = msg[1];
              return <AgentChatMessage key={index} message={content} isUser={isUser} />;
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg">
        <AgentChatInput />
      </div>
    </div>
  );
};

export default AgentChat;
