import { useState, useEffect, useRef } from "react";
import { Bot, Send, MessageSquare, Plus, Loader2 } from "lucide-react";
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
import { conversationsData, messagesData, botAutoResponses } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
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

    const botResponse = generateBotResponse(userMessage.content);
    const botMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      conversationId: currentConversationId,
      role: "assistant",
      content: botResponse,
      createdAt: new Date().toISOString()
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
              <SelectItem key={conv.id} value={conv.id}>
                <div className="flex flex-col gap-1 py-1">
                  <span className="font-medium">{conv.title}</span>
                  {conv.lastMessageAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(conv.lastMessageAt)}
                    </span>
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
            {displayMessages.map((message) => (
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
                
                <div
                  className={`max-w-[75%] ${
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-bl-none"
                      : "bg-muted text-foreground rounded-2xl rounded-br-none"
                  } px-4 py-3`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className="text-xs mt-2 opacity-70">
                    {formatTimestamp(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            
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
    </div>
  );
}
