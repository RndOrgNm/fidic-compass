import { useState, useMemo } from "react";
import { CheckCheck, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { overdueAlertsData } from "@/data/mockData";
import { AlertCard } from "./AlertCard";
import { toast } from "@/hooks/use-toast";

type AlertFilter = "all" | "unread" | "critical" | "high" | "acknowledged";

export function AlertsTab() {
  const [alerts, setAlerts] = useState(overdueAlertsData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("all");
  const [onlyActive, setOnlyActive] = useState(true);

  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    // Apply active filter
    if (onlyActive) {
      filtered = filtered.filter(a => a.status === "active");
    }

    // Apply tab filter
    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter(a => !a.acknowledged);
        break;
      case "critical":
        filtered = filtered.filter(a => a.severity === "critical");
        break;
      case "high":
        filtered = filtered.filter(a => a.severity === "high");
        break;
      case "acknowledged":
        filtered = filtered.filter(a => a.acknowledged);
        break;
    }

    // Sort: unacknowledged first, then by severity, then by date
    return filtered.sort((a, b) => {
      if (a.acknowledged !== b.acknowledged) {
        return a.acknowledged ? 1 : -1;
      }
      
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const aSeverity = severityOrder[a.severity as keyof typeof severityOrder];
      const bSeverity = severityOrder[b.severity as keyof typeof severityOrder];
      
      if (aSeverity !== bSeverity) {
        return aSeverity - bSeverity;
      }
      
      return new Date(b.alertDate).getTime() - new Date(a.alertDate).getTime();
    });
  }, [alerts, activeFilter, onlyActive]);

  const counts = useMemo(() => ({
    all: alerts.length,
    unread: alerts.filter(a => !a.acknowledged).length,
    critical: alerts.filter(a => a.severity === "critical").length,
    high: alerts.filter(a => a.severity === "high").length,
    acknowledged: alerts.filter(a => a.acknowledged).length,
  }), [alerts]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAlerts.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectAlert = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id 
        ? { 
            ...alert, 
            acknowledged: true, 
            acknowledgedBy: "Maria Silva",
            acknowledgedAt: new Date().toISOString()
          } as any
        : alert
    ));
    toast({
      title: "Alerta reconhecido",
      description: "Alerta reconhecido com sucesso",
    });
  };

  const handleAcknowledgeSelected = () => {
    if (selectedIds.length === 0) return;
    
    setAlerts(prev => prev.map(alert => 
      selectedIds.includes(alert.id)
        ? { 
            ...alert, 
            acknowledged: true, 
            acknowledgedBy: "Maria Silva",
            acknowledgedAt: new Date().toISOString()
          } as any
        : alert
    ));
    setSelectedIds([]);
    toast({
      title: "Alertas reconhecidos",
      description: `${selectedIds.length} alertas reconhecidos com sucesso`,
    });
  };

  const handleCreateCollectionAction = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const allSelected = filteredAlerts.length > 0 && selectedIds.length === filteredAlerts.length;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Inadimplência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as AlertFilter)}>
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="all" className="gap-2">
                Todos
                <Badge variant="secondary">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-2">
                Não Lidos
                <Badge variant="destructive">{counts.unread}</Badge>
              </TabsTrigger>
              <TabsTrigger value="critical" className="gap-2">
                Críticos
                <Badge variant="destructive">{counts.critical}</Badge>
              </TabsTrigger>
              <TabsTrigger value="high" className="gap-2">
                Altos
                <Badge className="bg-orange-600">{counts.high}</Badge>
              </TabsTrigger>
              <TabsTrigger value="acknowledged" className="gap-2">
                Reconhecidos
                <Badge className="bg-green-600">{counts.acknowledged}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Selecionar todos
                </label>
              </div>
              {selectedIds.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} alertas selecionados
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAcknowledgeSelected}
                disabled={selectedIds.length === 0}
                variant="outline"
                size="sm"
              >
                <CheckCheck className="h-4 w-4" />
                Reconhecer Selecionados
              </Button>
              <Button
                onClick={handleCreateCollectionAction}
                variant="outline"
                size="sm"
              >
                <PhoneCall className="h-4 w-4" />
                Criar Ação de Cobrança
              </Button>
              <div className="flex items-center gap-2 ml-4">
                <Checkbox
                  id="only-active"
                  checked={onlyActive}
                  onCheckedChange={(checked) => setOnlyActive(checked as boolean)}
                />
                <label htmlFor="only-active" className="text-sm cursor-pointer">
                  Apenas ativos
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                Nenhum alerta encontrado
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              selected={selectedIds.includes(alert.id)}
              onSelect={(checked) => handleSelectAlert(alert.id, checked)}
              onAcknowledge={() => handleAcknowledge(alert.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
