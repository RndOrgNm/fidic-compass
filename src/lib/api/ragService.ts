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

    const conversationsWithMetadata: ConversationWithMetadata[] = await Promise.all(
      conversations.map(async (conv) => {
        try {
          const messagesResponse = await getMessages(conv.conversation_id);
          const messages = messagesResponse.messages;

          let lastMessageAt: string | null = null;
          if (messages.length > 0) {
            const sortedMessages = [...messages].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            lastMessageAt = sortedMessages[0].created_at;
          }

          return {
            ...conv,
            lastMessageAt,
            messageCount: messages.length,
          };
        } catch (error) {
          console.error(
            `Error fetching messages for conversation ${conv.conversation_id}:`,
            error
          );
          return {
            ...conv,
            lastMessageAt: null,
            messageCount: 0,
          };
        }
      })
    );

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

    const queryResponse = await askQuery(query, 5, true);

    const assistantMessage = await addMessage(
      conversationId,
      "assistant",
      queryResponse.response,
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

