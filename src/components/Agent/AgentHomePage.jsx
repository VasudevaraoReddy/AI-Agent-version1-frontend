import { ChatProvider } from "../../context/ChatContext";
import AgentConversationList from "./AgentConversationList";
import AgentHeader from "./AgentHeader";
import AgentChat from "./AgentChat";

const AgentHomePage = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen">
        <AgentHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/4 min-w-[250px] max-w-[350px] h-full">
            <AgentConversationList />
          </div>
          <div className="flex-1 h-full">
            <AgentChat />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default AgentHomePage;
