import {
  askQuery,
  listConversations,
  createConversation,
  getConversation as getConversationApi,
  getMessages,
  addMessage,
  deleteConversation as deleteConversationApi,
  generateConversationTitle,
  type ConversationResponse,
  type MessageResponse,
  type ApiSource,
} from "./client";

export interface ConversationWithMetadata extends ConversationResponse {
  lastMessageAt?: string | null;
  messageCount?: number;
}

export class RAGService {
  async fetchConversations(
    limit: number = 50
  ): Promise<ConversationWithMetadata[]> {
    const response = await listConversations(limit);
    const conversations = response.conversations;

    // Use updated_at from conversations table instead of fetching messages
    // This avoids loading all messages when just listing conversations
    const conversationsWithMetadata: ConversationWithMetadata[] = conversations.map((conv) => {
      return {
        ...conv,
        lastMessageAt: conv.updated_at, // Use updated_at from conversations table
        messageCount: undefined, // Will be loaded only when conversation is selected
      };
    });

    return conversationsWithMetadata;
  }

  async createNewConversation(
    title: string = "Nova Conversa",
    user?: string
  ): Promise<ConversationResponse> {
    return createConversation(title, user);
  }

  async getConversation(
    conversationId: string
  ): Promise<ConversationResponse> {
    return getConversationApi(conversationId);
  }

  async loadConversationMessages(
    conversationId: string
  ): Promise<MessageResponse[]> {
    const response = await getMessages(conversationId);
    return response.messages;
  }

  async sendMessage(
    conversationId: string,
    query: string,
    isFirstMessage: boolean = false
  ): Promise<{ userMessage: MessageResponse; assistantMessage: MessageResponse }> {
    const userMessage = await addMessage(conversationId, "user", query);

    const queryResponse = await askQuery(query, 5, true, true); // use_agentic = true
    
    // Ensure response is a string and properly formatted
    let responseText = queryResponse.response;
    if (typeof responseText !== 'string') {
      console.warn('Response is not a string, converting:', typeof responseText);
      responseText = String(responseText);
    }

    const assistantMessage = await addMessage(
      conversationId,
      "assistant",
      responseText,
      queryResponse.sources
    );

    if (isFirstMessage) {
      try {
        await generateConversationTitle(conversationId, query);
      } catch (error) {
        console.error("Error generating conversation title:", error);
      }
    }

    return {
      userMessage,
      assistantMessage,
    };
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await deleteConversationApi(conversationId);
  }
}

export const ragService = new RAGService();

