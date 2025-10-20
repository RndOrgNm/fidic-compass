import { useState, useEffect, useRef } from "react";
import { Bot, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversationsData, messagesData, botAutoResponses } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export default function Agent() {
  const [conversations] = useState(conversationsData);
  const [currentConversationId, setCurrentConversationId] = useState("conv-001");
  const [messages, setMessages] = useState<Message[]>(messagesData["conv-001"] || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleConversationChange = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setMessages(messagesData[conversationId] || []);
    setInputValue("");
    setStreamingMessage("");
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
    if (msg.includes("investidor") || msg.includes("cotista")) {
      return botAutoResponses.investidores;
    }
    
    return botAutoResponses.default;
  };

  const streamText = async (text: string) => {
    setStreamingMessage("");
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setStreamingMessage(text.slice(0, i));
    }
    return text;
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
    scrollToBottom();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const botResponse = generateBotResponse(userMessage.content);
    const streamedText = await streamText(botResponse);
    
    const botMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      conversationId: currentConversationId,
      role: "assistant",
      content: streamedText,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setStreamingMessage("");
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = ["Resumo do dia", "Status de conciliação", "Inadimplentes críticos"];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-background">
        <Select value={currentConversationId} onValueChange={handleConversationChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conversations.map((conv) => (
              <SelectItem key={conv.id} value={conv.id}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{conv.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.lastMessageAt || conv.createdAt), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Olá! Sou seu assistente inteligente.</h3>
                <p className="text-muted-foreground mb-6">Como posso ajudá-lo hoje?</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "assistant"
                    ? "bg-blue-900 text-white rounded-bl-none"
                    : "bg-blue-100 text-slate-900 rounded-br-none"
                }`}
              >
                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content}
                </ReactMarkdown>
                <div className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ptBR })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-blue-900 text-white rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}

          {streamingMessage && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[75%] bg-blue-900 text-white rounded-2xl rounded-bl-none px-4 py-3">
                <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                  {streamingMessage}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
