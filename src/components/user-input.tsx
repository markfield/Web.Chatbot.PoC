import { useCallback, useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";

export const UserInput = ({
  sendMessage,
  isLoading,
}: {
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<null | HTMLInputElement>(null);

  const shufflePlaceholder = useCallback(() => {
    const placeholders = [
      "Ask a question...",
      "Can you tell me about tuition costs?",
      "What is the average class size?",
      "What is dorm life like?",
    ];

    if (inputRef.current) {
      const index = Math.floor(Math.random() * placeholders.length);
      inputRef.current.placeholder = placeholders[index];
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(shufflePlaceholder, 5000);
    return () => clearInterval(interval);
  }, [shufflePlaceholder]);

  const handleSendMessage = async () => {
    if (message) {
      setMessage("");
      await sendMessage(message);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="p-3 flex items-center gap-2 border-t-1 border-gray-300">
      <div className="grow">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={async (e) => {
            if (e.key === "Enter") {
              await handleSendMessage();
            }
          }}
          placeholder="Ask a question..."
          className="py-2 px-1 w-full border-b-1 border-b-white placeholder:text-slate-400 focus:outline-none transition-all ease-in-out focus:border-b-[#005be8]"
          autoFocus
          ref={inputRef}
        />
      </div>
      <button
        className={`bg-[#3BD5AE] flex-none text-white px-2 py-1 rounded-full w-8 h-8 cursor-pointer hover:bg-blue-600 disabled:bg-slate-300 disabled:text-gray-600 disabled:cursor-auto`}
        title="Ask a question"
        disabled={isLoading || !message}
        onClick={async () => await handleSendMessage()}
      >
        <MdSend />
      </button>
    </div>
  );
};
