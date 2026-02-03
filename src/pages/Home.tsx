import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeftRight, PhoneCall, Users, Shield, Bot, GitBranch } from "lucide-react";

const features = [
  {
    title: "Dashboard",
    description: "Visão consolidada de KPIs e alertas críticos",
    icon: BarChart3,
    color: "text-primary",
    bgColor: "bg-primary/10",
    route: "/dashboard",
  },
  {
    title: "Gestão de Recebimentos",
    description: "Conciliação, exceções e alertas de inadimplência",
    icon: ArrowLeftRight,
    color: "text-success",
    bgColor: "bg-success/10",
    route: "/receivables",
  },
  {
    title: "Pipeline de Investimentos",
    description: "Prospecção e alocação de recebíveis em fundos",
    icon: GitBranch,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    route: "/pipeline",
  },
  {
    title: "CRM",
    description: "Onboarding e gestão de cotistas",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    route: "/investors",
  },
  {
    title: "Chatbot",
    description: "Assistente inteligente para consultas e análises",
    icon: Bot,
    color: "text-primary",
    bgColor: "bg-gradient-to-br from-primary/20 to-purple-500/20",
    route: "/agent",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Bem-vindo ao FIDC Manager
        </h1>
        <p className="text-lg text-muted-foreground">
          Sistema de gestão integrada para fundos de direitos creditórios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => navigate(feature.route)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
