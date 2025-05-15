
import { Plus } from 'lucide-react';
import { useChatContext } from '../../context/ChatContext';

const AgentConversationList = () => {
  const { conversations, currentUser, switchUser, loading, createNewConversation } = useChatContext();

  return (
    <div className="p-4 border-r h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Conversations</h2>
        <button
          onClick={createNewConversation}
          disabled={loading}
          className="cursor-pointer flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>

      {loading && conversations.length === 0 ? (
        <div className="py-4 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cloud-blue mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading conversations...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-sm">No conversations found</p>
          ) : (
            conversations.map((userId) => (
              <button
                key={userId}
                className={`w-full justify-start text-left px-3 py-2 rounded-md border ${currentUser === userId
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                onClick={() => switchUser(userId)}
              >
                {userId}
              </button>

            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AgentConversationList;