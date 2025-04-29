import { useEffect, useRef } from "react";
import { MdPerson } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import umlLogo from "../assets/logo-uml-cube-padded-color.svg";
import { ChatMessage } from "../types/types";

export const ChatHistory = ({
  chatMessages,
}: {
  chatMessages: ChatMessage[];
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="h-[800px] overflow-y-scroll flex-col content-end">
      <div className="flex flex-col justify-end p-3 gap-6">
        {chatMessages.map((message, i) => (
          <ChatMessageEntry message={message} key={i} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

const ChatMessageEntry = ({
  message: { by, message, matches },
}: {
  message: ChatMessage;
}) => {
  return (
    <div className={`grid grid-cols-[2.5rem_1fr_2.5rem] gap-2 text-sm`}>
      <div className="flex items-end">
        {by === "ROWDY" && (
          <div className="h-10 w-10 p-2 flex items-center justify-center rounded-full text-center border-1 border-[#3BD5AE]">
            <img src={umlLogo} alt="UML Logo" />
          </div>
        )}
      </div>
      <div
        className={`${
          by === "USER" ? "bg-[#62DAFC]" : "bg-[#FFFAF1]"
        } rounded-xl p-2 shadow-lg`}
      >
        {message && <div>{message}</div>}
        {matches && matches.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {matches[0].response ? matches[0].response : matches[0].blurb}
              </ReactMarkdown>
            </div>

            {matches[0]?.searchResults?.length > 0 && (
              <div className="flex flex-col gap-2 shrink">
                <h3 className="font-anek font-bold">
                  Here's some helpful links:
                </h3>

                {matches[0].searchResults.map((result) => {
                  return (
                    <div key={result.link}>
                      <div className="bg-white p-2 rounded-xl shadow hover:brightness-95">
                        <a href={result.link} target="_blank">
                          <div
                            className={`font-anek mb-2 transition-all underline underline-offset-2 hover:decoration-2`}
                            dangerouslySetInnerHTML={{
                              __html: result.htmlTitle,
                            }}
                          ></div>
                          <div
                            className="ml-3 pl-1 text-xs text-gray-500 font-mono border-l-slate-300 border-l-1"
                            dangerouslySetInnerHTML={{
                              __html: result.htmlSnippet,
                            }}
                          ></div>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-end justify-end">
        {by === "USER" && (
          <div className="h-10 w-10 flex items-center justify-center rounded-full text-center border-1 border-[#62DAFC] text-2xl text-[#62DAFC]">
            <MdPerson />
          </div>
        )}
      </div>
    </div>
  );
};
