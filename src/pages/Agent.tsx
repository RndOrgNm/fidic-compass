import { useState, useEffect, useRef } from "react";
import { Bot, PanelRight, Settings, Trash2, Send, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { chatMessagesData, suggestedPrompts, mockResponses } from "@/data/mockData";
import ChatMessage from "@/components/agent/ChatMessage";
import SuggestedPrompts from "@/components/agent/SuggestedPrompts";
import InfoSidebar from "@/components/agent/InfoSidebar";
import ConversationSidebar from "@/components/agent/ConversationSidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type: string;
}

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getResponseForMessage = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("resumo") || lowerMessage.includes("métrica")) {
      return mockResponses.resumo;
    }
    if (lowerMessage.includes("conciliação") || lowerMessage.includes("banco")) {
      return mockResponses.conciliacao;
    }
    if (lowerMessage.includes("inadim") || lowerMessage.includes("atraso") || lowerMessage.includes("cobrança")) {
      return mockResponses.inadimplentes;
    }
    
    return mockResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: getResponseForMessage(userMessage.content),
        timestamp: new Date().toISOString(),
        type: "text"
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    
    if (confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
      setMessages([]);
      toast({
        title: "Conversa limpa",
        description: "Todas as mensagens foram removidas."
      });
    }
  };

  const handleNewConversation = () => {
    if (messages.length > 0) {
      setMessages([]);
      toast({
        title: "Nova conversa iniciada",
        description: "A conversa anterior foi arquivada."
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left Sidebar - Conversations */}
      {showLeftSidebar && (
        <ConversationSidebar onNewConversation={handleNewConversation} />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Agente FIDC</h1>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <span className="mr-1">●</span> Online
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Assistente inteligente - Sempre disponível</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRightSidebar(!showRightSidebar)}
              >
                <PanelRight className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: "Configurações", description: "Funcionalidade em desenvolvimento" })}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                disabled={messages.length === 0}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-12 w-12 text-blue-600" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">👋 Olá! Sou seu assistente inteligente do FIDC Manager.</h2>
                  <p className="text-muted-foreground">Como posso ajudá-lo hoje?</p>
                </div>
                <SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shrink-0">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div className="bg-slate-100 rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-card px-6 py-4 shadow-lg">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedPrompts.slice(0, 3).map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt.prompt)}
                  className="text-xs"
                >
                  {prompt.title}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua pergunta ou comando..."
              className="min-h-[60px] max-h-[200px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="lg"
              className="shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {inputValue.length} caracteres
            </p>
            <p className="text-xs text-muted-foreground">
              Enter para enviar • Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info */}
      {showRightSidebar && <InfoSidebar />}
    </div>
  );
}
