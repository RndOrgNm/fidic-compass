import { RAG_API_BASE_URL } from "./config";

export interface ApiError {
  detail: string;
}

export interface QueryRequest {
  query: string;
  top_k?: number;
  use_reranking?: boolean;
  use_agentic?: boolean;
}

export interface ApiSource {
  document_id?: string;
  section_id?: string;
  category?: string;
  page_number?: number;
  section_text?: string;
  [key: string]: any;
}

export interface QueryResponse {
  query: string;
  response: string;
  sources: ApiSource[];
}

export interface ConversationCreate {
  title: string;
  user?: string;
}

export interface ConversationResponse {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user?: string;
}

export interface ConversationListResponse {
  conversations: ConversationResponse[];
  total: number;
}

export interface MessageCreate {
  role: "user" | "assistant";
  content: string;
  sources?: ApiSource[];
}

export interface MessageResponse {
  message_id: string;
  conversation_id: string;
  role: string;
  content: string;
  sources?: ApiSource[] | null;
  created_at: string;
}

export interface ConversationMessagesResponse {
  conversation_id: string;
  messages: MessageResponse[];
  total: number;
}

export interface GenerateTitleRequest {
  query: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData: ApiError = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function askQuery(
  query: string,
  top_k: number = 5,
  use_reranking: boolean = false,
  use_agentic: boolean = true
): Promise<QueryResponse> {
  const response = await fetch(`${RAG_API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      top_k,
      use_reranking,
      use_agentic,
    } as QueryRequest),
  });

  return handleResponse<QueryResponse>(response);
}

export async function listConversations(
  limit: number = 50
): Promise<ConversationListResponse> {
  const response = await fetch(
    `${RAG_API_BASE_URL}/conversations?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<ConversationListResponse>(response);
}

export async function createConversation(
  title: string,
  user?: string
): Promise<ConversationResponse> {
  const response = await fetch(`${RAG_API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      user,
    } as ConversationCreate),
  });

  return handleResponse<ConversationResponse>(response);
}

export async function getConversation(
  conversationId: string
): Promise<ConversationResponse> {
  const response = await fetch(
    `${RAG_API_BASE_URL}/conversations/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<ConversationResponse>(response);
}

export async function deleteConversation(
  conversationId: string
): Promise<{ message: string }> {
  // Ensure the ID is a valid string
  if (!conversationId || typeof conversationId !== 'string' || !conversationId.trim()) {
    throw new Error("Invalid conversation ID");
  }
  
  // Trim whitespace and construct URL
  const trimmedId = conversationId.trim();
  const url = `${RAG_API_BASE_URL}/conversations/${trimmedId}`;
  console.log("Deleting conversation:", url);
  
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

  return handleResponse<{ message: string }>(response);
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error: Could not connect to the server. Please check your connection.");
    }
    throw error;
  }
}

export async function getMessages(
  conversationId: string
): Promise<ConversationMessagesResponse> {
  const response = await fetch(
    `${RAG_API_BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<ConversationMessagesResponse>(response);
}

export async function addMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  sources?: ApiSource[]
): Promise<MessageResponse> {
  const response = await fetch(
    `${RAG_API_BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        content,
        sources: sources || null,
      } as MessageCreate),
    }
  );

  return handleResponse<MessageResponse>(response);
}

export async function generateConversationTitle(
  conversationId: string,
  firstQuery: string
): Promise<ConversationResponse> {
  const response = await fetch(
    `${RAG_API_BASE_URL}/conversations/${conversationId}/generate-title`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: firstQuery,
      } as GenerateTitleRequest),
    }
  );

  return handleResponse<ConversationResponse>(response);
}
