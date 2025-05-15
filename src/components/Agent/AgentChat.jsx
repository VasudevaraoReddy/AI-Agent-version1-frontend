import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/ChatContext.jsx";
import { BadgeCheck, Cloud, Database, Server } from "lucide-react";
import AgentChatMessage from "./AgentChatMessage.jsx";
import AgentChatInput from "./AgentChatInput.jsx";

const AgentChat = () => {
  const { chatHistory, currentUser, currentCSP, loading, setCurrentCSP } =
    useChatContext();
  const messagesEndRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const cloudProviders = [
    { id: "aws", name: "AWS", color: "bg-white-100" },
    { id: "azure", name: "Azure", color: "bg-white-100" },
    { id: "gcp", name: "GCP", color: "bg-white-100" },
  ];

  const handleSelect = (id) => {
    setCurrentCSP(id);
    setShowDialog(false);
  };

  const getCSPDetails = () => {
    switch (currentCSP) {
      case "aws":
        return {
          color: "bg-yellow-600",
          name: "AWS",
          icon: <Cloud className="h-4 w-4 mr-1" />,
        };
      case "azure":
        return {
          color: "bg-blue-700",
          name: "Azure",
          icon: <Database className="h-4 w-4 mr-1" />,
        };
      case "gcp":
        return {
          color: "bg-red-600",
          name: "GCP",
          icon: <Server className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          color: "bg-gray-500",
          name: currentCSP || "Unknown",
          icon: <Cloud className="h-4 w-4 mr-1" />,
        };
    }
  };

  const cspDetails = getCSPDetails();
  const messages = chatHistory?.history || [];

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500 text-sm">
          Select a conversation to{" "}
          <button className="cursor-pointer underline">Start</button>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Conversation with {currentUser}
        </h2>
        <div
          className={`text-white flex items-center px-3 py-1 rounded-full ${cspDetails.color}`}
        >
          {cspDetails.icon}
          <span className="text-sm">{cspDetails.name}</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {loading && messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Loading conversation...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div>
            <p className="text-center text-gray-400 py-8 text-sm">
               No messages yet
               <br/>
               <br/>
              You have selected <span className="font-bold uppercase">{currentCSP}</span>.
              <a
                onClick={() => setShowDialog(true)}
                className="m-1 p-2 underline text-black cursor-pointer"
              >
                Change CSP
              </a>
            </p>
            {/* Dialog */}
            {showDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    Choose Your Cloud Provider
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {cloudProviders.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => handleSelect(provider.id)}
                        className={`relative cursor-pointer p-4 rounded-lg text-center border transition-all ${
                          currentCSP === provider.id
                            ? "border-cloud-blue ring-2 ring-cloud-blue"
                            : "border-gray-300 hover:shadow"
                        } ${provider.color}`}
                      >
                        {currentCSP === provider.id && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full text-xs flex items-center justify-center">
                            <BadgeCheck className="w-4 h-4" />
                          </div>
                        )}
                        <div className="text-lg font-medium">
                          {provider.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowDialog(false)}
                      className="mt-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isUser = msg.role === "human";
              const content = msg.content;
              return (
                <AgentChatMessage
                  key={index}
                  message={content}
                  isUser={isUser}
                />
              );
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
