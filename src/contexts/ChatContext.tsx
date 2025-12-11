import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { ragService, type ConversationWithMetadata } from "@/lib/api/ragService";
import type { ApiSource } from "@/lib/api/client";

export interface Message {
  message_id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sources?: ApiSource[] | null;
}

export interface Conversation extends ConversationWithMetadata {
  title: string;
  created_at: string;
  updated_at: string;
  user?: string;
}

interface PendingMessage {
  conversationId: string;
  query: string;
  userMessage: Message;
  status: "pending" | "processing" | "completed" | "error";
  assistantMessage?: Message;
  error?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  isLoadingConversations: boolean;
  streamingMessage: Message | null;
  pendingMessages: Map<string, PendingMessage>;
  
  setCurrentConversationId: (id: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setStreamingMessage: (message: Message | null) => void;
  
  refreshConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (query: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  resetToInitialState: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [pendingMessages, setPendingMessages] = useState<Map<string, PendingMessage>>(new Map());
  
  const isSendingMessageRef = useRef(false);

  const resetToInitialState = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
    setStreamingMessage(null);
    setIsLoading(false);
  }, []);

  const refreshConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const fetchedConversations = await ragService.fetchConversations(50);
      setConversations(fetchedConversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Erro ao carregar conversas",
        description: error instanceof Error ? error.message : "Não foi possível carregar as conversas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    // Don't reload messages if we're currently sending a message
    if (isSendingMessageRef.current) {
      return;
    }

    try {
      const fetchedMessages = await ragService.loadConversationMessages(conversationId);
      setMessages(fetchedMessages as Message[]);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error instanceof Error ? error.message : "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    }
  }, []);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    isSendingMessageRef.current = true;

    // Store the conversation ID at the start so we can track even if user navigates away
    const messageId = `pending-${Date.now()}`;

    try {
      // Create a new conversation if one doesn't exist
      let conversationIdAtSend = currentConversationId;
      let isNewConversation = false;
      
      if (!conversationIdAtSend) {
        const newConv = await ragService.createNewConversation("Nova Conversa");
        conversationIdAtSend = newConv.conversation_id;
        isNewConversation = true;
        setCurrentConversationId(conversationIdAtSend);
        await refreshConversations();
      }

      const currentConv = conversations.find(c => c.conversation_id === conversationIdAtSend);
      // Only generate title if it's a new conversation OR if the conversation still has the default title
      const shouldGenerateTitle = isNewConversation || !currentConv || currentConv.title === "Nova Conversa";

      // Create a temporary user message for immediate display
      const tempUserMessage: Message = {
        message_id: `temp-user-${Date.now()}`,
        conversation_id: conversationIdAtSend,
        role: "user",
        content: query,
        created_at: new Date().toISOString(),
      };

      // Add temp message immediately
      setMessages(prev => [...prev, tempUserMessage]);

      // Track this as a pending message
      const pending: PendingMessage = {
        conversationId: conversationIdAtSend,
        query,
        userMessage: tempUserMessage,
        status: "processing",
      };
      setPendingMessages(prev => new Map(prev).set(messageId, pending));

      // Make the API call - this will continue even if component unmounts
      const { userMessage, assistantMessage } = await ragService.sendMessage(
        conversationIdAtSend,
        query,
        shouldGenerateTitle
      );

      // Update pending message with result
      setPendingMessages(prev => {
        const newMap = new Map(prev);
        newMap.set(messageId, {
          ...pending,
          status: "completed",
          assistantMessage: assistantMessage as Message,
        });
        return newMap;
      });

      // Update messages - replace temp with real and add assistant response
      setMessages(prev => {
        const filtered = prev.filter(m => m.message_id !== tempUserMessage.message_id);
        return [...filtered, userMessage as Message, assistantMessage as Message];
      });
      
      setStreamingMessage(assistantMessage as Message);

      if (shouldGenerateTitle) {
        try {
          const updatedConv = await ragService.getConversation(conversationIdAtSend);
          setConversations(prev =>
            prev.map(c =>
              c.conversation_id === conversationIdAtSend
                ? { ...c, title: updatedConv.title }
                : c
            )
          );
        } catch (titleError) {
          console.error("Error updating conversation title:", titleError);
        }
      }

      await refreshConversations();

      // Clean up pending message after a delay
      setTimeout(() => {
        setPendingMessages(prev => {
          const newMap = new Map(prev);
          newMap.delete(messageId);
          return newMap;
        });
      }, 5000);

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update pending message with error
      setPendingMessages(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(messageId);
        if (existing) {
          newMap.set(messageId, {
            ...existing,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
        return newMap;
      });

      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isSendingMessageRef.current = false;
    }
  }, [currentConversationId, conversations, isLoading, refreshConversations]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!conversationId || !conversationId.trim()) {
      toast({
        title: "Erro",
        description: "ID da conversa inválido",
        variant: "destructive",
      });
      return;
    }

    try {
      await ragService.deleteConversation(conversationId);
      
      // If we deleted the current conversation, clear it
      if (conversationId === currentConversationId) {
        resetToInitialState();
      }
      
      // Refresh the conversations list
      await refreshConversations();
      
      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível excluir a conversa";
      toast({
        title: "Erro ao excluir conversa",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [currentConversationId, refreshConversations, resetToInitialState]);

  const value: ChatContextType = {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    isLoadingConversations,
    streamingMessage,
    pendingMessages,
    
    setCurrentConversationId,
    setMessages,
    setStreamingMessage,
    
    refreshConversations,
    loadMessages,
    sendMessage,
    deleteConversation,
    resetToInitialState,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

