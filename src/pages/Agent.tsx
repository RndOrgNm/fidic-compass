import { useState, useEffect, useRef } from "react";
import { Bot, Send, MessageSquare, Plus, Loader2, ChevronLeft, ChevronRight, Trash2, Edit2, X, Check } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { conversationsData, messagesData, botAutoResponses, pdfPagesData, type MessageSource } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  sources?: MessageSource[];
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  messageCount: number;
}

export default function Agent() {
  const [conversations, setConversations] = useState<Conversation[]>(conversationsData);
  const [currentConversationId, setCurrentConversationId] = useState<string>("conv-001");
  const [messages, setMessages] = useState<Message[]>(messagesData["conv-001"] || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 100;
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteConvId, setDeleteConvId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    if (streamingMessage) {
      let index = 0;
      const fullText = streamingMessage.content;
      setDisplayedText("");

      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setStreamingMessage(null);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [streamingMessage]);

  const handleConversationChange = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setMessages(messagesData[conversationId] || []);
    setInputValue("");
    setStreamingMessage(null);
    setDisplayedText("");
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      userId: "user-001",
      title: "Nova Conversa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: null,
      messageCount: 0
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
    setInputValue("");
    setStreamingMessage(null);
    setDisplayedText("");
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

  const determineResponseType = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("resumo") || msg.includes("métrica") || msg.includes("kpi")) {
      return "resumo";
    }
    if (msg.includes("concilia") || msg.includes("banco")) {
      return "conciliacao";
    }
    if (msg.includes("inadim") || msg.includes("atraso") || msg.includes("vencid")) {
      return "inadimplencia";
    }
    return "default";
  };

  const generateMockSources = (responseType: string): MessageSource[] => {
    if (responseType === "resumo" || responseType === "conciliacao") {
      return [
        {
          section_id: "Art. 15 - §1º",
          page_number: 34,
          section_text: "Regulamentação sobre processos de conciliação e prazos estabelecidos...",
          metadata: {
            document_name: "Manual Operacional",
            chapter: "Capítulo 5"
          }
        },
        {
          section_id: "Seção 3 - Controles",
          page_number: 56,
          section_text: "Descrição dos controles internos e procedimentos de auditoria...",
          metadata: {
            document_name: "Compliance",
            chapter: "Seção 3"
          }
        }
      ];
    }
    
    if (responseType === "inadimplencia") {
      return [
        {
          section_id: "Art. 8º - Cobrança",
          page_number: 19,
          section_text: "Procedimentos de cobrança escalonados conforme gravidade do atraso e valor envolvido...",
          metadata: {
            document_name: "Manual de Cobrança",
            chapter: "Capítulo 2"
          }
        }
      ];
    }
    
    return [];
  };

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("resumo") || msg.includes("métrica") || msg.includes("kpi")) {
      return botAutoResponses.resumo;
    }
    if (msg.includes("concilia") || msg.includes("banco")) {
      return botAutoResponses.conciliacao;
    }
    if (msg.includes("inadim") || msg.includes("atraso") || msg.includes("vencid")) {
      return botAutoResponses.inadimplencia;
    }
    if (msg.includes("investidor") || msg.includes("cotista") || msg.includes("onboarding")) {
      return botAutoResponses.investidores;
    }
    
    return botAutoResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: currentConversationId,
      role: "user",
      content: inputValue.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Update conversation title if it's the first message
    const currentConv = conversations.find(c => c.id === currentConversationId);
    if (currentConv && currentConv.messageCount === 0) {
      const updatedConversations = conversations.map(c => 
        c.id === currentConversationId 
          ? { ...c, title: userMessage.content.slice(0, 50), messageCount: 1 }
          : c
      );
      setConversations(updatedConversations);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const responseType = determineResponseType(userMessage.content);
    const botResponse = generateBotResponse(userMessage.content);
    const sources = generateMockSources(responseType);
    
    const botMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      conversationId: currentConversationId,
      role: "assistant",
      content: botResponse,
      createdAt: new Date().toISOString(),
      sources: sources.length > 0 ? sources : undefined
    };

    setMessages(prev => [...prev, botMessage]);
    setStreamingMessage(botMessage);
    setIsLoading(false);
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

  const handleDeleteConversation = (convId: string) => {
    setDeleteConvId(convId);
  };

  const confirmDeleteConversation = () => {
    if (!deleteConvId) return;
    
    const updatedConversations = conversations.filter(c => c.id !== deleteConvId);
    setConversations(updatedConversations);
    
    if (currentConversationId === deleteConvId) {
      if (updatedConversations.length > 0) {
        const newCurrentId = updatedConversations[0].id;
        setCurrentConversationId(newCurrentId);
        setMessages(messagesData[newCurrentId] || []);
      } else {
        handleNewConversation();
      }
    }
    
    setDeleteConvId(null);
  };

  const handleEditConversation = (convId: string, currentTitle: string) => {
    setEditingConvId(convId);
    setEditingTitle(currentTitle);
  };

  const saveEditedTitle = () => {
    if (!editingConvId || !editingTitle.trim()) return;
    
    const updatedConversations = conversations.map(c =>
      c.id === editingConvId ? { ...c, title: editingTitle.trim() } : c
    );
    setConversations(updatedConversations);
    setEditingConvId(null);
    setEditingTitle("");
  };

  const cancelEditTitle = () => {
    setEditingConvId(null);
    setEditingTitle("");
  };

  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const displayMessages = messages.map(msg => ({
    ...msg,
    content: msg.id === streamingMessage?.id ? displayedText : msg.content
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-card p-4 flex items-center gap-4">
        <Select value={currentConversationId} onValueChange={handleConversationChange}>
          <SelectTrigger className="w-[400px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{currentConversation?.title}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {conversations.map((conv) => (
              <SelectItem key={conv.id} value={conv.id} className="cursor-pointer">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex flex-col gap-1 py-1 flex-1 min-w-0 overflow-hidden">
                    {editingConvId === conv.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditedTitle();
                            if (e.key === "Escape") cancelEditTitle();
                          }}
                          className="h-7 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 hover:bg-accent"
                          onClick={saveEditedTitle}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 hover:bg-accent"
                          onClick={cancelEditTitle}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium truncate max-w-full">{conv.title}</span>
                        {conv.lastMessageAt && (
                          <span className="text-xs text-muted-foreground truncate">
                            {formatTimestamp(conv.lastMessageAt)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {editingConvId !== conv.id && (
                    <div className="flex gap-1 flex-shrink-0 ml-auto" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleEditConversation(conv.id, conv.title)}
                        title="Editar título"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteConversation(conv.id)}
                        title="Deletar conversa"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
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
              const displayContent = message === streamingMessage ? displayedText : message.content;
              
              return (
                <div
                  key={message.id}
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
                        {formatTimestamp(message.createdAt)}
                      </div>
                    </div>
                    
                    {/* Sources Section */}
                    {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/40">
                        <p className="text-xs text-muted-foreground mb-2">Fontes:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {message.sources.map((source, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="flex flex-col items-start h-auto py-2 px-3 hover:bg-accent"
                              onClick={() => openPdfViewer(source.page_number)}
                              title={source.section_text.substring(0, 150) + "..."}
                            >
                              <span className="text-xs font-medium truncate w-full text-left">
                                {source.section_id}
                              </span>
                              <Badge variant="secondary" className="text-xs mt-1">
                                Pág. {source.page_number}
                              </Badge>
                            </Button>
                          ))}
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
            <div className="bg-white shadow-xl" style={{ aspectRatio: "1/1.414", maxHeight: "70vh" }}>
              <img
                src={pdfPagesData[currentPage] || "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=800&fit=crop"}
                alt={`Página ${currentPage}`}
                className="w-full h-full object-contain"
              />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConvId} onOpenChange={() => setDeleteConvId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A conversa e todas as mensagens serão permanentemente removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
