import { useState, useEffect, useRef } from "react";
import { Bot, Send, MessageSquare, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { ragService, type ConversationWithMetadata } from "@/lib/api/ragService";
import type { MessageResponse, ApiSource } from "@/lib/api/client";

interface Message {
  message_id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sources?: ApiSource[] | null;
}

interface Conversation extends ConversationWithMetadata {
  title: string;
  created_at: string;
  updated_at: string;
  user?: string;
}

export default function Agent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    const loadConversations = async () => {
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
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) {
        setMessages([]);
        return;
      }

      try {
        const fetchedMessages = await ragService.loadConversationMessages(currentConversationId);
        setMessages(fetchedMessages as Message[]);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Erro ao carregar mensagens",
          description: error instanceof Error ? error.message : "Não foi possível carregar as mensagens",
          variant: "destructive",
        });
      }
    };

    loadMessages();
  }, [currentConversationId]);

  useEffect(() => {
    if (!streamingMessage) return;

    let index = 0;
    const fullText = streamingMessage.content;
    let mounted = true;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (!mounted) {
        clearInterval(interval);
        return;
      }

      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        if (mounted) {
          setStreamingMessage(null);
        }
      }
    }, 20);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [streamingMessage]);

  const handleConversationChange = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setInputValue("");
    setStreamingMessage(null);
    setDisplayedText("");
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await ragService.createNewConversation("Nova Conversa");
      setConversations([newConv, ...conversations]);
      setCurrentConversationId(newConv.conversation_id);
      setMessages([]);
      setInputValue("");
      setStreamingMessage(null);
      setDisplayedText("");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erro ao criar conversa",
        description: error instanceof Error ? error.message : "Não foi possível criar uma nova conversa",
        variant: "destructive",
      });
    }
  };

  const openPdfViewer = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setPdfViewerOpen(true);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentConversationId) return;

    const query = inputValue.trim();
    const conversationIdAtSend = currentConversationId;
    setInputValue("");
    setIsLoading(true);

    try {
      const currentConv = conversations.find(c => c.conversation_id === conversationIdAtSend);
      const isFirstMessage = !currentConv || (currentConv.messageCount ?? 0) === 0;

      const { userMessage, assistantMessage } = await ragService.sendMessage(
        conversationIdAtSend,
        query,
        isFirstMessage
      );

      if (conversationIdAtSend === currentConversationId) {
        setMessages(prev => [...prev, userMessage as Message, assistantMessage as Message]);
        setStreamingMessage(assistantMessage as Message);
      }

      if (isFirstMessage) {
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

      const updatedConversations = await ragService.fetchConversations(50);
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  };

  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const currentConversation = conversations.find(c => c.conversation_id === currentConversationId);
  const displayMessages = messages.map(msg => ({
    ...msg,
    content: msg.message_id === streamingMessage?.message_id ? displayedText : msg.content
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-card p-4 flex items-center gap-4">
        <Select value={currentConversationId || undefined} onValueChange={handleConversationChange}>
          <SelectTrigger className="w-[400px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{currentConversation?.title || "Selecione uma conversa"}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoadingConversations ? (
              <SelectItem value="loading" disabled>
                Carregando...
              </SelectItem>
            ) : conversations.length === 0 ? (
              <SelectItem value="empty" disabled>
                Nenhuma conversa
              </SelectItem>
            ) : (
              conversations.map((conv) => (
                <SelectItem key={conv.conversation_id} value={conv.conversation_id}>
                  <div className="flex flex-col gap-1 py-1">
                    <span className="font-medium">{conv.title}</span>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        <Button onClick={handleNewConversation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="rounded-full bg-primary/10 p-6">
              <Bot className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Olá! Sou seu assistente inteligente.</h2>
              <p className="text-muted-foreground">Como posso ajudá-lo hoje?</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent px-4 py-2"
                onClick={() => handleSuggestionClick("Resumo do dia")}
              >
                Resumo do dia
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent px-4 py-2"
                onClick={() => handleSuggestionClick("Status de conciliação")}
              >
                Status de conciliação
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent px-4 py-2"
                onClick={() => handleSuggestionClick("Inadimplentes críticos")}
              >
                Inadimplentes críticos
              </Badge>
            </div>
          </div>
        ) : (
          <>
            {displayMessages.map((message) => {
              const displayContent = message.message_id === streamingMessage?.message_id ? displayedText : message.content;
              
              return (
                <div
                  key={message.message_id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 max-w-[75%]">
                    <div
                      className={`${
                        message.role === "assistant"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-bl-none"
                          : "bg-muted text-foreground rounded-2xl rounded-br-none"
                      } px-4 py-3`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{displayContent}</ReactMarkdown>
                      </div>
                      <div className="text-xs mt-2 opacity-70">
                        {formatTimestamp(message.created_at)}
                      </div>
                    </div>
                    
                    {/* Sources Section */}
                    {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <p className="text-xs text-muted-foreground mb-2">Fontes:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {message.sources.map((source, idx) => {
                            const pageNumber = source.page_number;
                            const sectionText = source.section_text || "";
                            const sectionId = source.section_id || `Fonte ${idx + 1}`;
                            
                            return (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="flex flex-col items-start h-auto py-2 px-3 hover:bg-accent"
                                onClick={() => {
                                  if (pageNumber) {
                                    openPdfViewer(pageNumber);
                                  } else {
                                    toast({
                                      title: "Informação não disponível",
                                      description: "Número da página não disponível para esta fonte",
                                    });
                                  }
                                }}
                                title={sectionText.substring(0, 150) + (sectionText.length > 150 ? "..." : "")}
                                disabled={!pageNumber}
                              >
                                <span className="text-xs font-medium truncate w-full text-left">
                                  {sectionId}
                                </span>
                                {pageNumber && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    Pág. {pageNumber}
                                  </Badge>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Documento - Página {currentPage}</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-6 bg-slate-100">
            <div className="bg-white shadow-xl p-8 rounded-lg">
              <p className="text-muted-foreground text-center">
                Visualização de PDF não disponível no momento.
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Página {currentPage}
              </p>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
