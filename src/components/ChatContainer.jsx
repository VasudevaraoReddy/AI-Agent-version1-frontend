// import { useState, useEffect, useRef } from "react";
// import Message from "./Message";
// import ChatInput from "./ChatInput";
// import { Loader2 } from "lucide-react";
// import { v4 as uuidv4 } from 'uuid';
// import { useDispatch, useSelector } from "react-redux";
// import { sendChatQuery, fetchConversation } from "../services/ApiServices.js";
// import { setAllConversations, setSelectedUserID } from "../features/conversations/conversationsSlice.js";


// const ChatContainer = ({ cloudProvider }) => {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [CSP, setCSP] = useState(cloudProvider)
//   //   const { toast } = useToast();
//   const messagesEndRef = useRef(null);
//   const dispatch = useDispatch()
//   const formState = useSelector((state) => state?.formData)
//   const conversationState = useSelector((state) => state?.conversationState)
//   const userId = conversationState?.userID

//   const fetchConversations = async (id) => {
//     try {
//       const response = await fetchConversation({id})
//       if (response?.id === "null") {
//         if (Array.isArray(response?.data.userIds)) {
//           dispatch(setAllConversations(response?.data.userIds));
//         }
//       }
//       else {
//         dispatch(setMessages(response?.data.conversation))
//         setCSP(response?.data.csp)
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     }
//   };

//   useEffect(() => {
//     fetchConversations("null");
//     const id = uuidv4();
//     dispatch(setSelectedUserID(id))
//   }, []);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (text) => {
//     console.log(text)
//     if (!text.trim()) return;

//     // Update UI immediately
//     const userMessage = { text, isUser: true };
//     setMessages(prev => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       const response = await sendChatQuery({ text, userId, cloudProvider });
//       // Add bot response to chat
//       const botMessage = {
//         text: response.summary,
//         isUser: false,
//         isCode: response.isCode,
//         ...response
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Error sending message:", error);

//       // Remove the user message if it failed
//       setMessages(prev => prev.filter(m => m !== messages[messages.length - 1]));
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const callSelectedUserConversation = async (id) => {
//     fetchConversations(id);
//     dispatch(setSelectedUserID(id))
//   }


//   return (
//     <div className="flex flex-row content-between">
//       <div className="bg-white rounded-md p-2 w-[15%] mr-1">
//         <div className="space-y-2 overflow-y-auto max-h-[80vh]">
//           {conversationState?.allConversations.length > 0 ? conversationState?.allConversations.map((e, index) => (
//             <div
//               key={e}
//               title={e}
//               className={`p-1 rounded cursor-pointer ${userId === e ? 'bg-blue-200' : 'bg-gray-200'}`}
//               onClick={() => callSelectedUserConversation(e)}
//             >
//               <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{e}</p>
//             </div>
//           )) : <p>No Conversations</p>}
//         </div>
//       </div>
//       <div className="p-2 bg-white rounded-md w-[70%] mx-auto h-[calc(100vh-12rem)]">
//         <div className="pb-2">
//           <div className="flex items-center gap-2">
//             <span className="text-primary text-xl">Cloud Studio</span>
//             {CSP &&
//               <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">{CSP.toUpperCase()}</span>}
//           </div>
//         </div>

//         <div className="flex flex-col h-[calc(100%-5rem)]">
//           <div className="flex-1 pr-4" style={{ overflowY: 'auto' }}>
//             <div className="flex flex-col gap-4 pb-4">
//               {messages.map((message, index) => (
//                 <Message
//                   key={index}
//                   text={message.text}
//                   isUser={message.isUser}
//                   isCode={message.isCode}
//                   userId={userId}
//                   message={message}
//                 />
//               ))}
//               {isLoading && (
//                 <div className="flex items-center justify-center py-2">
//                   <Loader2 className="h-8 w-8 text-primary animate-spin" />
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           </div>
//           <div className="pt-4">
//             {messages[messages.length - 1]?.isTool === true && messages[messages.length - 1]?.isErrorInTool === false ? "" : <ChatInput
//               onSubmit={sendMessage}
//               isLoading={isLoading}
//               placeholder={`Ask about ${cloudProvider?.toUpperCase() || 'cloud'} services...`}
//             />}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;


import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import { sendChatQuery, fetchConversation } from "../services/ApiServices.js";
import { setAllConversations, setCSP, setMessages, setSelectedUserID } from "../features/conversations/conversationsSlice.js";


const ChatContainer = ({ cloudProvider }) => {
  const [isLoading, setIsLoading] = useState(false);
  //   const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch()
  const formState = useSelector((state) => state?.formData)
  const conversationState = useSelector((state) => state?.conversationState)
  const userId = conversationState?.userID

  const fetchConversations = async (id) => {
    try {
      const response = await fetchConversation({ id })
      if (response?.id === "null") {
        if (Array.isArray(response?.data.userIds)) {
          dispatch(setAllConversations(response?.data.userIds));
        }
      }
      else {
        dispatch(setMessages(response?.data.conversation))
        dispatch(setCSP(response?.data.csp))
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations("null");
    const id = uuidv4();
    dispatch(setSelectedUserID(id))
  }, []);

  // Scroll to bottom when conversationState?.messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationState?.messages]);

  const sendMessage = async (text) => {
    console.log(text)
    if (!text.trim()) return;

    // Update UI immediately
    const userMessage = { text, isUser: true };
    const updatedMessages = [...conversationState.messages, userMessage];
    dispatch(setMessages(updatedMessages));
    setIsLoading(true);

    try {
      const response = await sendChatQuery({ text, userId, cloudProvider: conversationState?.csp });
      const botMessage = {
        text: response.summary,
        isUser: false,
        isCode: response.isCode,
        ...response
      };

      dispatch(setMessages([...updatedMessages, botMessage])); // Use the updated one here
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }

  };


  const callSelectedUserConversation = async (id) => {
    fetchConversations(id);
    dispatch(setSelectedUserID(id))
  }


  return (
    <div className="flex flex-row content-between">
      <div className="bg-white rounded-md p-2 w-[15%] mr-1">
        <div className="space-y-2 overflow-y-auto max-h-[80vh]">
          {conversationState?.allConversations.length > 0 ? conversationState?.allConversations.map((e, index) => (
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
      <div className="p-2 bg-white rounded-md w-[70%] mx-auto h-[calc(100vh-12rem)]">
        <div className="pb-2">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl">Cloud Studio</span>
            {conversationState?.csp &&
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset">{conversationState?.csp.toUpperCase()}</span>}
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-5rem)]">
          <div className="flex-1 pr-4" style={{ overflowY: 'auto' }}>
            <div className="flex flex-col gap-4 pb-4">
              {conversationState?.messages.map((message, index) => (
                <Message
                  key={index}
                  text={message.text}
                  isUser={message.isUser}
                  isCode={message.isCode}
                  userId={userId}
                  message={message}
                />
              ))}
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="pt-4">
            {conversationState?.messages[conversationState?.messages.length - 1]?.isTool === true && conversationState?.messages[conversationState?.messages.length - 1]?.isErrorInTool === false ? "" : <ChatInput
              onSubmit={sendMessage}
              isLoading={isLoading}
              placeholder={`Ask about ${conversationState?.csp?.toUpperCase() || 'cloud'} services...`}
            />}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;