import { Card } from "@/components/ui/card";
import { BarChart3, Receipt, PhoneCall, Users, Shield, TrendingUp } from "lucide-react";

interface Prompt {
  id: string;
  category: string;
  icon: string;
  title: string;
  prompt: string;
}

interface SuggestedPromptsProps {
  prompts: Prompt[];
  onPromptClick: (prompt: string) => void;
}

const iconMap: Record<string, any> = {
  BarChart3,
  Receipt,
  PhoneCall,
  Users,
  Shield,
  TrendingUp
};

export default function SuggestedPrompts({ prompts, onPromptClick }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      {prompts.map((prompt) => {
        const Icon = iconMap[prompt.icon];
        return (
          <Card
            key={prompt.id}
            className="p-4 cursor-pointer hover:bg-accent hover:shadow-md transition-all hover:scale-105"
            onClick={() => onPromptClick(prompt.prompt)}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                {Icon && <Icon className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{prompt.category}</p>
                <h3 className="font-medium text-sm">{prompt.title}</h3>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
