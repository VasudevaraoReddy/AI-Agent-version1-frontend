// services/chatbotService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.102:3001';

export const sendChatQuery = async ({ text, userId, cloudProvider }) => {
    try {
        const response = await axios.post(`${API_URL}/api/chatbot1`, {
            query: text,
            userId,
            csp: cloudProvider
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Chatbot request failed:', error);
        throw error;
    }
};


export const fetchConversation = async ({ id }) => {
    try {
        if (id === "null") {
            const response = await axios.get(`${API_URL}/api/conversations`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return { id: "null", data: response.data }
        }
        else {
            const response = await axios.get(`${API_URL}/api/conversations?id=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return { id: id, data: response.data }
        }
    } catch (error) {
        console.error('Chatbot request failed:', error);
        throw error;
    }
};
