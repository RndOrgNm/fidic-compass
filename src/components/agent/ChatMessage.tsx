import { Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    type: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para área de transferência"
    });
  };

  const handleRegenerate = () => {
    toast({
      title: "Regenerando resposta",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedbackGiven(type);
    toast({
      title: "Obrigado pelo feedback!",
      description: type === "up" ? "Ficamos felizes que gostou!" : "Vamos trabalhar para melhorar."
    });
  };

  const isAssistant = message.role === "assistant";
  const relativeTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div
      className={`flex items-start gap-3 ${!isAssistant ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {isAssistant ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shrink-0">
          <Bot className="h-6 w-6 text-white" />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600 shrink-0">
          <User className="h-6 w-6 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 ${!isAssistant ? "flex flex-col items-end" : ""} max-w-[80%]`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isAssistant
              ? "bg-slate-100 text-slate-900"
              : "bg-blue-600 text-white"
          }`}
        >
          {isAssistant ? (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                a: ({ href, children }) => (
                  <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1">
          {relativeTime}
        </p>

        {/* Action Buttons (for assistant messages only) */}
        {isAssistant && showActions && (
          <div className="flex items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRegenerate}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${feedbackGiven === "up" ? "text-green-600" : ""}`}
              onClick={() => handleFeedback("up")}
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${feedbackGiven === "down" ? "text-red-600" : ""}`}
              onClick={() => handleFeedback("down")}
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
