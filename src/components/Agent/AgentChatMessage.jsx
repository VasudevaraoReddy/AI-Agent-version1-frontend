import React, { useState } from 'react';
import { ArrowUpRight, UserCircle, Bot } from "lucide-react";
import { useChatContext } from '../../context/ChatContext.jsx';

const AgentChatMessage = ({ message, isUser }) => {
    const { sendMessage, chatHistory } = useChatContext();
    const [formData, setFormData] = useState({}); // Store form field values

    const wasMenuItemSelected = (menuItem) => {
        const messages = chatHistory.history || [];
        const currentMessageIndex = messages.findIndex(
            msg => msg?.role === 'assistant' &&
                (msg?.content === message ||
                    (typeof msg[1] === 'object' && msg[1].response === message.response))
        );

        if (currentMessageIndex === -1 || currentMessageIndex === messages.length - 1) {
            return false;
        }

        const nextMessage = messages[currentMessageIndex + 1];
        return nextMessage && nextMessage?.role === 'human' && nextMessage?.content === menuItem;
    };

    const handleMenuItemClick = (option) => {
        sendMessage(option);
    };

    const handleInputChange = (fieldId, value) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = () => {
        console.log(formData)
    };

    const renderMenu = (menuItems) => {
        if (!menuItems || !menuItems.length) return null;

        return (
            <div className="mt-3">
                <p className="font-medium mb-2">Options:</p>
                <div className="flex flex-row flex-wrap gap-2">
                    {menuItems.map((item, index) => {
                        const isSelected = wasMenuItemSelected(item);
                        return (
                            <button
                                key={index}
                                onClick={() => handleMenuItemClick(item)}
                                disabled={isSelected}
                                className={`flex cursor-pointer items-center text-left px-3 py-2 rounded-md text-sm transition-colors border 
                                    ${isSelected
                                        ? 'bg-gray-200 text-gray-700 border-gray-300 disabled:cursor-not-allowed'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                                    }`}
                            >
                                <span>{item}</span>
                                <ArrowUpRight className="h-4 w-4 ml-1" />
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderRequiredFields = (fields) => {
        if (!fields || !fields.length) return null;

        return (
            <div className="mt-3 space-y-3">
                <p className="font-medium">Required Information:</p>
                {fields.map((field) => (
                    <div key={field.fieldId} className="flex flex-col">
                        <label className="text-sm mb-1">{field.fieldName}</label>
                        <input
                            type="text"
                            placeholder={field.fieldName}
                            value={formData[field.fieldId] || ''}
                            onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                ))}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                    Submit
                </button>
            </div>
        );
    };

    const renderComplexMessage = (message) => {
        if (message.role === "assistant" && message.response) {
            const { response } = message;

            return (
                <div>
                    <p>{response.message}</p>

                    {response.availableServices && (
                        <div className="mt-3">
                            <p className="font-medium mb-2">Available Services:</p>
                            <ul className="list-disc pl-5">
                                {response.availableServices.map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {response.service?.requiredFields && renderRequiredFields(response.service.requiredFields)}
                    {response.menu && renderMenu(response.menu)}
                </div>
            );
        }

        return <p>{typeof message === 'string' ? message : JSON.stringify(message)}</p>;
    };

    return (
        <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <Bot className="w-6 h-6 mt-1 text-gray-400" />}

            <div
                className={`p-4 max-w-[80%] rounded-lg shadow-sm ${isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-white text-gray-900 border border-gray-200 mr-auto'
                    }`}
            >
                {isUser ? <p>{message}</p> : renderComplexMessage(message)}
            </div>

            {isUser && <UserCircle className="w-6 h-6 mt-1 text-blue-300" />}
        </div>
    );
};

export default AgentChatMessage;
