import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFieldValue, resetForm, setFormSubmitted } from '../features/form/formSlice.js';
import { setMessages } from '../features/conversations/conversationsSlice.js';
import { sendChatQuery } from '../services/ApiServices.js';

const Message = ({ text, isUser, isCode, userId, message }) => {
  const formValues = useSelector((state) => state.formData.values);
  const formSliceState = useSelector((state) => state?.formData)
  const conversationState = useSelector((state) => state?.conversationState)
  const dispatch = useDispatch();
  const [submittedJSON, setSubmittedJSON] = useState(null);

  const handleChange = (fieldName, value) => {
    dispatch(setFieldValue({ field: fieldName, value }));
  };

  const callSendChatQuery = async () => {
    const text = `These are the values ${JSON.stringify(formValues)}, go ahead and deploy it`
    const userMessage = { text, isUser: true };
    dispatch(setMessages([...conversationState?.messages, userMessage]))

    try {
      const response = await sendChatQuery({ text, userId, cloudProvider: conversationState?.csp });
      // Add bot response to chat
      const botMessage = {
        text: response.summary,
        isUser: false,
        isCode: response.isCode,
        ...response
      };
      dispatch(setMessages([...conversationState?.messages, botMessage]))
    } catch (error) {
      console.error("Error sending message:", error);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to deploy this configuration?");
    if (!confirmed) return;
    setSubmittedJSON(formValues);
    dispatch(setFormSubmitted(true))
    await callSendChatQuery();
    dispatch(resetForm());
    console.log('Submitted JSON:', JSON.stringify(formValues, null, 2));
  };

  const handleCancel = () => {
    dispatch(resetForm());
    setSubmittedJSON(null);
    dispatch(setFormSubmitted(false))
  };

  if (typeof text === 'object' && text?.tool === true) {
    return (
      <>
        {message?.isErrorInTool === true ? <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-4 w-full`}>
          <p className='rounded-lg max-w-md bg-gray-200 p-3 text-black'>Something went wrong in Form</p>
        </div> : <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-4 w-full`}>
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:max-w-full border border-gray-300">
            <h3 className="font-bold text-lg text-blue-600 mb-2">{text?.response?.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{text?.response?.description}</p>

            <form className="flex flex-wrap gap-4" onSubmit={handleSubmit}>
              {text?.response?.requiredFields?.map((field, index) => (
                <div key={index} className="flex-1 min-w-[200px]">
                  {field.type === 'input' ? (
                    <input
                      placeholder={field.fieldName}
                      type="text"
                      required
                      value={formValues[field.fieldId] || ''}
                      onChange={(e) => handleChange(field.fieldId, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required
                      value={formValues[field.fieldId] || ''}
                      onChange={(e) => handleChange(field.fieldId, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="" disabled>Select {field.fieldName}</option>
                      <option value="Standard_B1s">Standard_B1s</option>
                      <option value="Standard_B2s">Standard_B2s</option>
                      <option value="Standard_D2s_v3">Standard_D2s_v3</option>
                    </select>
                  ) : null}
                </div>
              ))}

              <div className="flex justify-end w-full gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>

            {submittedJSON && (
              <div className="mt-4 bg-gray-100 p-2 rounded text-sm text-gray-800">
                <strong>Submitted JSON:</strong>
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(submittedJSON, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>}
      </>
    );
  }

  // Default message rendering
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`rounded-lg ${isUser
            ? 'max-w-md overflow-auto bg-blue-100 border border-blue-300 p-3 text-black'
            : 'max-w-md bg-gray-200 p-3 text-black'
          }`}
      >
        {isCode ? (
          <pre className="w-full bg-gray-100 p-2 rounded overflow-auto text-sm font-mono">
            <code>
              {Array.isArray(text)
                ? text.map((e) => e?.text || e).join('\n')
                : text}
            </code>
          </pre>
        ) : Array.isArray(text) ? (
          text.map((e, idx) => (
            <p key={idx}>
              {(e?.text || e)
                ?.split('\n')
                .map((line, i) => <div key={i}>{line}</div>)}
            </p>
          ))
        ) : typeof text === 'string' ? (
          text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default Message;
