import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  PhoneCall,
  FileText,
  History,
  Check,
  Shield,
  Lock,
  BarChart,
  AlertTriangle,
  PieChart,
  Workflow,
  List,
  Info,
  CheckCircle,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertDetailsModal } from "./AlertDetailsModal";
import { toast } from "@/hooks/use-toast";

interface AlertCardProps {
  alert: any;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onAcknowledge: () => void;
}

export function AlertCard({ alert, selected, onSelect, onAcknowledge }: AlertCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatCnpj = (cnpj: string) => {
    if (cnpj.length === 18) return cnpj; // Already formatted
    if (cnpj.length === 14) {
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return cnpj;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          badge: "🚨 CRÍTICO",
          cardClass: "bg-red-50 border-l-4 border-red-600",
          badgeClass: "bg-red-600 text-white",
        };
      case "high":
        return {
          badge: "⚠️ ALTO",
          cardClass: "bg-orange-50 border-l-4 border-orange-600",
          badgeClass: "bg-orange-600 text-white",
        };
      case "medium":
        return {
          badge: "🟡 MÉDIO",
          cardClass: "bg-yellow-50 border-l-4 border-yellow-600",
          badgeClass: "bg-yellow-600 text-white",
        };
      default:
        return {
          badge: "🔵 BAIXO",
          cardClass: "bg-blue-50 border-l-4 border-blue-600",
          badgeClass: "bg-blue-600 text-white",
        };
    }
  };

  const getTitle = () => {
    switch (alert.type) {
      case "payment_overdue":
        return `Recebível vencido há ${alert.daysOverdue} dias | ${formatCurrency(alert.amount)}`;
      case "score_deterioration":
        return `Score do cedente caiu ${alert.scoreDrop} pontos`;
      case "concentration_risk":
        return "Limite de concentração excedido";
      case "multiple_overdue":
        return "Múltiplos atrasos do mesmo sacado";
      default:
        return "Alerta";
    }
  };

  const severityConfig = getSeverityConfig(alert.severity);

  const handleAction = (actionName: string) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  return (
    <>
      <Card className={cn("transition-all", severityConfig.cardClass)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={severityConfig.badgeClass}>
                    {severityConfig.badge}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getRelativeTime(alert.alertDate)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {alert.acknowledged ? (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Reconhecido por {alert.acknowledgedBy}</span>
                </div>
              ) : (
                <Badge variant="destructive">Novo</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title */}
          <h3 className="text-lg font-bold">{getTitle()}</h3>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {alert.type === "payment_overdue" && (
              <>
                <div>
                  <span className="text-muted-foreground">Recebível:</span>
                  <span className="ml-2 font-medium">{alert.receivableNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sacado:</span>
                  <span className="ml-2 font-medium">{alert.debtorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CNPJ:</span>
                  <span className="ml-2 font-medium">{formatCnpj(alert.debtorCnpj)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cedente:</span>
                  <span className="ml-2 font-medium">{alert.originatorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimento:</span>
                  <span className="ml-2 font-medium">{formatDate(alert.dueDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dias em atraso:</span>
                  <Badge variant={alert.daysOverdue > 5 ? "destructive" : "secondary"} className="ml-2">
                    {alert.daysOverdue} dias
                  </Badge>
                </div>
              </>
            )}

            {alert.type === "score_deterioration" && (
              <>
                <div>
                  <span className="text-muted-foreground">Cedente:</span>
                  <span className="ml-2 font-medium">{alert.originatorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Score:</span>
                  <span className="ml-2 font-medium">
                    {alert.previousScore} → {alert.currentScore}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Queda:</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-600">-{alert.scoreDrop} pontos</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Exposição total:</span>
                  <span className="ml-2 font-medium">{formatCurrency(alert.totalExposure)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Recebíveis afetados:</span>
                  <span className="ml-2 font-medium">{alert.receivablesCount}</span>
                </div>
              </>
            )}

            {alert.type === "concentration_risk" && (
              <>
                <div>
                  <span className="text-muted-foreground">Sacado:</span>
                  <span className="ml-2 font-medium">{alert.debtorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CNPJ:</span>
                  <span className="ml-2 font-medium">{formatCnpj(alert.debtorCnpj)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Concentração atual:</span>
                  <Badge className="ml-2 bg-orange-600">{alert.concentration}%</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Limite estabelecido:</span>
                  <span className="ml-2 font-medium">{alert.limit}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Exposição:</span>
                  <span className="ml-2 font-medium">{formatCurrency(alert.totalExposure)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantidade de recebíveis:</span>
                  <span className="ml-2 font-medium">{alert.receivablesCount}</span>
                </div>
              </>
            )}

            {alert.type === "multiple_overdue" && (
              <>
                <div>
                  <span className="text-muted-foreground">Sacado:</span>
                  <span className="ml-2 font-medium">{alert.debtorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CNPJ:</span>
                  <span className="ml-2 font-medium">{formatCnpj(alert.debtorCnpj)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Recebíveis em atraso:</span>
                  <Badge variant="destructive" className="ml-2">{alert.overdueCount}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor total:</span>
                  <span className="ml-2 font-medium">{formatCurrency(alert.totalOverdueAmount)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mais antigo:</span>
                  <Badge variant="destructive" className="ml-2">{alert.oldestDaysOverdue} dias</Badge>
                </div>
              </>
            )}
          </div>

          {/* Additional Info */}
          {alert.additionalInfo && (
            <>
              <Separator />
              <div className="flex gap-2 p-3 bg-muted/50 rounded-md">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{alert.additionalInfo}</p>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          {alert.type === "payment_overdue" && (
            <>
              <Button size="sm" onClick={() => handleAction("Iniciar Cobrança")}>
                <PhoneCall className="h-4 w-4" />
                Iniciar Cobrança
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
                <FileText className="h-4 w-4" />
                Ver Detalhes do Recebível
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction("Ver Histórico")}>
                <History className="h-4 w-4" />
                Ver Histórico
              </Button>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  <Check className="h-4 w-4" />
                  Reconhecer
                </Button>
              )}
            </>
          )}

          {alert.type === "score_deterioration" && (
            <>
              <Button size="sm" onClick={() => handleAction("Revisar Limite")}>
                <Shield className="h-4 w-4" />
                Revisar Limite de Crédito
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction("Solicitar Garantias")}>
                <Lock className="h-4 w-4" />
                Solicitar Garantias
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
                <BarChart className="h-4 w-4" />
                Ver Exposição Completa
              </Button>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  <Check className="h-4 w-4" />
                  Reconhecer
                </Button>
              )}
            </>
          )}

          {alert.type === "concentration_risk" && (
            <>
              <Button size="sm" onClick={() => handleAction("Revisar Política")}>
                <AlertTriangle className="h-4 w-4" />
                Revisar Política de Risco
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
                <PieChart className="h-4 w-4" />
                Ver Detalhes da Concentração
              </Button>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  <Check className="h-4 w-4" />
                  Reconhecer
                </Button>
              )}
            </>
          )}

          {alert.type === "multiple_overdue" && (
            <>
              <Button size="sm" onClick={() => handleAction("Criar Workflow")}>
                <Workflow className="h-4 w-4" />
                Criar Workflow de Cobrança
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
                <List className="h-4 w-4" />
                Ver Todos os Recebíveis
              </Button>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  <Check className="h-4 w-4" />
                  Reconhecer
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>

      <AlertDetailsModal
        alert={alert}
        open={showDetails}
        onOpenChange={setShowDetails}
        onAcknowledge={onAcknowledge}
      />
    </>
  );
}
