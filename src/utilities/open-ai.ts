import { Messages, Run, Suggestions, Thread } from "../types/types";
import { getTimeout, sleep } from "./sleep";
import { getWebsiteSearchResults } from "./uml-search";

const defaultHeaders = new Headers();
defaultHeaders.append("OpenAI-Beta", "assistants=v2");
defaultHeaders.append("Content-Type", "application/json");
defaultHeaders.append(
  "Authorization",
  `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
);

export const sendAndGetResponse = async (prompt: string) => {
  const thread = await initiateThread(prompt);
  const messages = await getResponseMessage(thread.thread_id);
  await deleteThread(thread.thread_id);

  const suggestions = JSON.parse(
    messages.data[0].content[0].text.value
  ) as Suggestions;

  await Promise.all(
    suggestions.matches.map(async (match) => {
      match.searchResults = match.keywords
        ? await getWebsiteSearchResults(match.keywords)
        : [];
    })
  );

  return suggestions;
};

const initiateThread = async (prompt: string) => {
  const raw = JSON.stringify({
    assistant_id: import.meta.env.VITE_ASSISTANT_ID,
    thread: {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
  });

  const response = await fetch("https://api.openai.com/v1/threads/runs", {
    method: "POST",
    headers: defaultHeaders,
    body: raw,
    redirect: "follow",
  });

  const responseJson = await response.json();

  return responseJson as Thread;
};

const getStatus = async (threadId: string) => {
  const response = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/runs`,
    {
      headers: defaultHeaders,
      redirect: "follow",
    }
  );

  const responseJson = (await response.json()) as Run;

  return responseJson.data[0].status;
};

const getMessages = async (threadId: string) => {
  const response = await fetch(
    `https://api.openai.com/v1/threads/${threadId}/messages`,
    {
      headers: defaultHeaders,
      redirect: "follow",
    }
  );

  const responseJson = (await response.json()) as Messages;

  return responseJson;
};

const getResponseMessage = async (threadId: string) => {
  let status = null;
  const limit = 15;
  let retries = 0;

  do {
    status = await getStatus(threadId);
    console.log(`Try ${retries}: status`);
    retries++;
    await sleep(getTimeout(retries));
  } while (status !== "completed" && retries < limit);

  return await getMessages(threadId);
};

const deleteThread = async (threadId: string) => {
  await fetch(`https://api.openai.com/v1/threads/${threadId}`, {
    method: "DELETE",
    headers: defaultHeaders,
    redirect: "follow",
  });
};
