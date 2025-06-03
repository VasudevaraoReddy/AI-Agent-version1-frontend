const API_BASE_URL = "http://localhost:3000/agent";

export const fetchConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const fetchConversationHistory = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversation history');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    throw error;
  }
};

export const sendMessage = async (message, userId, csp, fields) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userId,
        csp,
        ...(fields && { fields }),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};