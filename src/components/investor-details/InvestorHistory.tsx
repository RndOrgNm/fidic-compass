import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Shield,
  FileText,
  Mail,
  UserPlus,
  PartyPopper,
} from "lucide-react";
import { investorActivityHistory } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InvestorHistoryProps {
  investorId: string;
}

export function InvestorHistory({ investorId }: InvestorHistoryProps) {
  const [typeFilter, setTypeFilter] = useState("all");
  const activities = (investorActivityHistory as any)[investorId] || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <ArrowUpCircle className="h-6 w-6 text-green-600" />;
      case "redemption":
        return <ArrowDownCircle className="h-6 w-6 text-red-600" />;
      case "kyc_renewal":
        return <Shield className="h-6 w-6 text-blue-600" />;
      case "document_update":
        return <FileText className="h-6 w-6 text-orange-600" />;
      case "communication":
        return <Mail className="h-6 w-6 text-gray-600" />;
      case "onboarding":
        return <UserPlus className="h-6 w-6 text-purple-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      default:
        return null;
    }
  };

  const filteredActivities = activities.filter((act: any) => {
    if (typeFilter === "all") return true;
    return act.activityType === typeFilter;
  });

  const handleExport = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Exportação de histórico em desenvolvimento",
    });
  };

  const firstActivity = activities[0];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico de Atividades</CardTitle>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="subscription">Aplicações</SelectItem>
                  <SelectItem value="redemption">Resgates</SelectItem>
                  <SelectItem value="kyc_renewal">KYC/Compliance</SelectItem>
                  <SelectItem value="document_update">Documentos</SelectItem>
                  <SelectItem value="communication">Comunicações</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                Exportar Histórico
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity: any, index: number) => {
          const isFirst = activity.id === firstActivity?.id;

          return (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full ${
                    isFirst ? "bg-yellow-100 p-3" : "bg-primary/10 p-2"
                  }`}
                >
                  {isFirst ? (
                    <PartyPopper className="h-6 w-6 text-yellow-600" />
                  ) : (
                    getActivityIcon(activity.activityType)
                  )}
                </div>
                {index < filteredActivities.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2 flex-1" />
                )}
              </div>

              <Card
                className={`flex-1 ${
                  isFirst ? "border-yellow-500 border-2" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {isFirst && (
                        <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                          🎉 Início da Jornada
                        </Badge>
                      )}
                      <h3 className="font-semibold">{activity.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>

                  {/* Activity-specific details */}
                  {(activity.activityType === "subscription" ||
                    activity.activityType === "redemption") && (
                    <div className="mt-3 p-3 bg-muted rounded-md space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fundo:</span>
                        <span className="font-medium">{activity.fundName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cotas:</span>
                        <span className="font-medium">
                          {formatNumber(activity.quotaQuantity)}
                        </span>
                      </div>
                    </div>
                  )}

                  {isFirst && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                      Primeira atividade deste investidor em nossa plataforma
                    </div>
                  )}

                  <div className="mt-3 text-xs text-muted-foreground">
                    Executado por: {activity.performedBy}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhuma atividade encontrada para os filtros selecionados
            </p>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline">Carregar Mais Atividades</Button>
        </div>
      )}
    </div>
  );
}
