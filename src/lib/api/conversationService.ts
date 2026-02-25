import { CONVERSATION_SERVICE_URL } from "./config";
import type {
  ApiError,
  ConversationCreate,
  ConversationResponse,
  ConversationListResponse,
  ConversationMessagesResponse,
  GenerateTitleRequest,
} from "./client";

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

export async function conversationListConversations(
  limit: number = 50
): Promise<ConversationListResponse> {
  const response = await fetch(
    `${CONVERSATION_SERVICE_URL}/conversations?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return handleResponse<ConversationListResponse>(response);
}

export async function conversationCreateConversation(
  title: string,
  user?: string
): Promise<ConversationResponse> {
  const response = await fetch(`${CONVERSATION_SERVICE_URL}/conversations`, {
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

export async function conversationGetConversation(
  conversationId: string
): Promise<ConversationResponse> {
  const response = await fetch(
    `${CONVERSATION_SERVICE_URL}/conversations/${conversationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return handleResponse<ConversationResponse>(response);
}

export async function conversationGetMessages(
  conversationId: string
): Promise<ConversationMessagesResponse> {
  const response = await fetch(
    `${CONVERSATION_SERVICE_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return handleResponse<ConversationMessagesResponse>(response);
}

export async function conversationDeleteConversation(
  conversationId: string
): Promise<{ message: string }> {
  if (!conversationId || typeof conversationId !== "string" || !conversationId.trim()) {
    throw new Error("Invalid conversation ID");
  }
  const trimmedId = conversationId.trim();
  const url = `${CONVERSATION_SERVICE_URL}/conversations/${trimmedId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse<{ message: string }>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Could not connect to the server. Please check your connection."
      );
    }
    throw error;
  }
}

export async function conversationGenerateTitle(
  conversationId: string,
  firstQuery: string
): Promise<ConversationResponse> {
  const response = await fetch(
    `${CONVERSATION_SERVICE_URL}/conversations/${conversationId}/generate-title`,
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
