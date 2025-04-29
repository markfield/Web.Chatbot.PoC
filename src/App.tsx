import { useState } from "react";
import "./App.css";
import umlLogo from "./assets/logo-uml-cube-padded-color.svg";
import { ChatHistory } from "./components/chat-history";
import { UserInput } from "./components/user-input";
import { ChatMessage } from "./types/types";
import { sendAndGetResponse } from "./utilities/open-ai";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      by: "ROWDY",
      message: "How can I help?",
    },
  ]);

  const handleSendMessage = async (message: string) => {
    console.log(message);
    setIsLoading(true);

    setChatMessages((prev) => [
      ...prev,
      {
        by: "USER",
        message: message,
      },
    ]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          by: "ROWDY",
          message: "Rowdy is typing...",
        },
      ]);
    }, 500);

    const response = await sendAndGetResponse(message);

    const newChatMessage = {
      by: "ROWDY",
      matches: [...response.matches],
    };

    setChatMessages((prev) => [...prev.slice(0, -1), newChatMessage]);

    setIsLoading(false);
  };

  return (
    <div className="font-barlow text-black flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="border-1 border-gray-300 shadow-lg w-1/3 max-w-[500px] min-w-[375px]">
        <div className="flex items-center gap-3 bg-[#005be8] text-white p-2 font-bold tracking-wider shadow-md shadow-slate-300">
          <div>
            <img className="h-10 w-10" src={umlLogo} alt="UML Logo" />
          </div>
          <div className="font-mono tracking-wider">UMass Lowell Chatbot</div>
        </div>
        <div className="mt-1">
          <ChatHistory chatMessages={chatMessages} />
        </div>
        <div>
          <UserInput sendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
