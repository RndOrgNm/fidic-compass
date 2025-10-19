import { useState } from "react";
import { RefreshCw, TrendingUp, Receipt, AlertTriangle, CheckCircle, AlertCircle, TrendingDown, ArrowLeftRight, FileText, ArrowDownCircle, UserPlus, PhoneCall } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { dashboardData } from "@/data/mockData";

const iconMap = {
  TrendingUp,
  Receipt,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  ArrowLeftRight,
  FileText,
  ArrowDownCircle,
  UserPlus,
  PhoneCall
};

export default function Dashboard() {
  const [period, setPeriod] = useState("30");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "Dashboard atualizado com sucesso",
    });
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    const periodLabels: Record<string, string> = {
      "1": "Hoje",
      "7": "Últimos 7 dias",
      "30": "Últimos 30 dias",
      "90": "Últimos 90 dias"
    };
    toast({
      title: "Período alterado",
      description: `Visualizando: ${periodLabels[value]}`,
    });
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-500 border-l-4";
      case "high":
        return "bg-orange-50 border-orange-500 border-l-4";
      case "medium":
        return "bg-yellow-50 border-yellow-500 border-l-4";
      default:
        return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Médio</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão consolidada de KPIs e alertas críticos</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Hoje</SelectItem>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.kpis.map((kpi, index) => {
          const Icon = iconMap[kpi.icon as keyof typeof iconMap];
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{kpi.label}</p>
                          <p className="text-2xl font-bold mt-2">{kpi.value}</p>
                          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                            kpi.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {kpi.trend === "up" ? "↑" : "↓"}
                            <span>{kpi.change}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          kpi.trend === "up" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            kpi.trend === "up" ? "text-green-600" : "text-red-600"
                          }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Variação no período selecionado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚨</span>
              Alertas Críticos
            </CardTitle>
            <CardDescription>Últimas 24 horas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.criticalAlerts.map((alert) => {
              const Icon = iconMap[alert.icon as keyof typeof iconMap];
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg ${getSeverityStyles(alert.severity)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(alert.severity)}
                          <p className="font-bold text-sm">{alert.title}</p>
                        </div>
                        {alert.description && (
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        )}
                        {alert.amount && (
                          <p className="text-sm font-bold">{alert.amount}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "Esta funcionalidade será implementada em breve",
                      })}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📋</span>
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData.recentActivities.map((activity, index) => {
                const Icon = iconMap[activity.icon as keyof typeof iconMap];
                const isLast = index === dashboardData.recentActivities.length - 1;
                return (
                  <div key={activity.id} className="relative">
                    <div className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {!isLast && (
                          <div className="absolute top-10 h-full w-0.5 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1 pb-4">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => toast({
                title: "Funcionalidade em desenvolvimento",
                description: "Lista completa de atividades será implementada em breve",
              })}
            >
              Ver todas as atividades
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
