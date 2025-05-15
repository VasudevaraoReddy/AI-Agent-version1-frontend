import { createContext, useContext, useState, useEffect } from 'react';
import { fetchConversations, fetchConversationHistory, sendMessage } from '../services/AgentService.js';

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCSP, setCurrentCSP] = useState("aws"); // Default to AWS

  // Fetch list of conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        if (data.length > 0 && !currentUser) {
          setCurrentUser(data[0]);
        }
        setLoading(false);
      } catch (error) {
        // toast({
        //   title: "Error",
        //   description: "Failed to load conversations",
        //   variant: "destructive",
        // });
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Load chat history when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadChatHistory(currentUser);
    }
  }, [currentUser]);

  const loadChatHistory = async (userId) => {
    try {
      setLoading(true);
      const data = await fetchConversationHistory(userId);
      setChatHistory(data);

      // Extract current CSP from history
      if (data && data.csp) {
        setCurrentCSP(data.csp);
      }

      setLoading(false);
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load chat history",
      //   variant: "destructive",
      // });
      setLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      setLoading(true);

      if (!currentUser) {
        throw new Error("No user selected");
      }

      const response = await sendMessage(message, currentUser, currentCSP);

      // Update chat history after sending message
      await loadChatHistory(currentUser);

      setLoading(false);
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const switchUser = (userId) => {
    setCurrentUser(userId);
  };

  const createNewConversation = async () => {
    try {
      setLoading(true);

      // Generate a new user ID with timestamp to ensure uniqueness
      const newUserId = `user${Date.now()}`;

      // Add new user ID to conversations list
      setConversations(prev => [...prev, newUserId]);

      // Switch to the new user
      setCurrentUser(newUserId);

      // Initialize empty chat history
      setChatHistory({ csp: currentCSP, history: [] });

      toast({
        title: "Success",
        description: "New conversation created",
      });

      setLoading(false);
      return newUserId;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
      setLoading(false);
      throw error;
    }
  };

  const value = {
    conversations,
    currentUser,
    chatHistory,
    loading,
    currentCSP,
    setCurrentCSP,
    sendMessage: handleSendMessage,
    switchUser,
    refreshHistory: () => loadChatHistory(currentUser),
    createNewConversation
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};