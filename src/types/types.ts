export type Thread = {
  thread_id: string;
  id: string;
};

export type Run = {
  data: {
    status:
      | "completed"
      | "queued"
      | "in_progress"
      | "requires_action"
      | "cancelling"
      | "cancelled"
      | "failed"
      | "completed"
      | "incomplete"
      | "expired";
  }[];
};

export type Messages = {
  data: {
    content: {
      type: string;
      text: {
        value: string;
      };
    }[];
  }[];
};

export type SearchResult = {
  title: string;
  htmlTitle: string;
  link: string;
  snippet: string;
  htmlSnippet: string;
};

export type SearchResponse = {
  results: SearchResult[];
};

export type Match = {
  // url: string;
  // title: string;
  keywords: string;
  blurb: string;
  response: string;
  searchResults: SearchResult[];
};

export type Suggestions = {
  matches: Match[];
};

export type ChatMessage = {
  by: string;
  message?: string;
  matches?: Match[];
};
