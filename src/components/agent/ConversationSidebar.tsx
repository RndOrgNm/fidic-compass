import { MessageSquarePlus, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ConversationSidebarProps {
  onNewConversation: () => void;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messageCount: number;
}

export default function ConversationSidebar({ onNewConversation }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Análise de inadimplência",
      timestamp: "Há 2 dias",
      messageCount: 8
    },
    {
      id: "conv-2",
      title: "Status de conciliação",
      timestamp: "Há 5 dias",
      messageCount: 5
    },
    {
      id: "conv-3",
      title: "Relatório mensal",
      timestamp: "Há 1 semana",
      messageCount: 12
    }
  ]);

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja deletar esta conversa?")) {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      toast({
        title: "Conversa deletada",
        description: "A conversa foi removida com sucesso."
      });
    }
  };

  const handleConversationClick = (conv: Conversation) => {
    toast({
      title: "Carregando conversa",
      description: "Funcionalidade em desenvolvimento"
    });
  };

  return (
    <div className="w-[280px] border-r bg-card flex flex-col">
      <div className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Conversas</h2>
        <Button onClick={onNewConversation} className="w-full" size="lg">
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          Nova Conversa
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className="p-3 cursor-pointer hover:bg-accent transition-colors group relative"
              onClick={() => handleConversationClick(conv)}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{conv.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                    <Badge variant="secondary" className="text-xs">
                      {conv.messageCount}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
