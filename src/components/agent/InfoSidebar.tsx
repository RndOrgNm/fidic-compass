import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  User,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Bug
} from "lucide-react";
import { agentCapabilities } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function InfoSidebar() {
  const navigate = useNavigate();
  const currentTime = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const quickLinks = [
    { label: "Ver Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Conciliação Pendente", path: "/receivables?tab=reconciliation", icon: CheckCircle2 },
    { label: "Alertas Críticos", path: "/receivables?tab=alerts&filter=critical", icon: AlertCircle },
    { label: "Pipeline Onboarding", path: "/investors?tab=onboarding", icon: User }
  ];

  return (
    <div className="w-[320px] border-l bg-card flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Contextual Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informações Contextuais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{currentTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Maria Silva</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recebíveis ativos:</span>
                  <Badge variant="secondary">1.847</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conciliação do dia:</span>
                  <Badge variant="secondary">94%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alertas críticos:</span>
                  <Badge variant="destructive">5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Atalhos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(link.path)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Agent Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Capacidades do Agente</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {agentCapabilities.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-sm">
                      {category.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {category.capabilities.map((capability, capIndex) => (
                          <li key={capIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={() => toast({ title: "Documentação", description: "Funcionalidade em desenvolvimento" })}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Documentação completa
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={() => toast({ title: "Reportar problema", description: "Funcionalidade em desenvolvimento" })}
        >
          <Bug className="mr-2 h-4 w-4" />
          Reportar problema
        </Button>
        <p className="text-xs text-muted-foreground text-center pt-2">
          v1.0.0-beta
        </p>
      </div>
    </div>
  );
}
