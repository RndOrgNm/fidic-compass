import { useState } from "react";
import { LayoutList, LayoutGrid, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonitoramentoKanban } from "./MonitoramentoKanban";
import { MonitoramentoListView } from "./MonitoramentoListView";
import { MonitoramentoDetailsModal } from "./MonitoramentoDetailsModal";
import type { MonitoramentoPipelineItem } from "./MonitoramentoCard";
import type { MonitoramentoPipelineStatus } from "@/data/pipelineData";
import { useMonitoramento, useUpdateMonitoramento } from "@/hooks/useMonitoramento";
import { toast } from "@/hooks/use-toast";
import type { MonitoramentoStatus } from "@/lib/api/monitoramentoService";

const CURRENT_USER_PLACEHOLDER = "Maria Silva";

export function MonitoramentoTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  const filters: { status?: MonitoramentoStatus } = {};
  if (statusFilter !== "all") filters.status = statusFilter as MonitoramentoStatus;

  const { data, isLoading, error, refetch, isRefetching } = useMonitoramento(filters);
  const updateMonitoramento = useUpdateMonitoramento();

  const items = data?.items ?? [];
  const filteredItems = items.filter((i) => {
    if (assignedFilter === "mine" && i.assigned_to !== CURRENT_USER_PLACEHOLDER) return false;
    if (assignedFilter === "unassigned" && i.assigned_to != null) return false;
    return true;
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRefresh = () => refetch();

  const handleStatusChange = async (itemId: string, newStatus: MonitoramentoPipelineStatus) => {
    try {
      await updateMonitoramento.mutateAsync({
        id: itemId,
        payload: {
          status: newStatus,
          status_started_at: new Date().toISOString(),
        },
      });
      const columnTitle =
        {
          alertas_deteccao: "Alertas Detecção",
          correcoes_acoes: "Correções/Ações",
          relatorios_em_andamento: "Relatórios em Andamento",
          em_conformidade_auditoria: "Em conformidade/Auditoria",
          encerrado: "Encerrado",
        }[newStatus] ?? newStatus;
      toast({ title: "Monitoramento movido", description: `Movido para ${columnTitle}` });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível mover o monitoramento.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePendingItems = async (itemId: string, pendingItems: string[]) => {
    try {
      await updateMonitoramento.mutateAsync({
        id: itemId,
        payload: { pending_items: pendingItems },
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os itens pendentes.",
        variant: "destructive",
      });
    }
  };

  const selectedItem = filteredItems.find((i) => i.id === selectedItemId) ?? null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monitoramento</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <Button
                  size="sm"
                  variant={viewMode === "kanban" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("kanban")}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Kanban
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <LayoutList className="h-4 w-4" />
                  Lista
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefetching}
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="alertas_deteccao">Alertas Detecção</SelectItem>
                  <SelectItem value="correcoes_acoes">Correções/Ações</SelectItem>
                  <SelectItem value="relatorios_em_andamento">Relatórios em Andamento</SelectItem>
                  <SelectItem value="em_conformidade_auditoria">Em conformidade/Auditoria</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Atribuído a</label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Atribuído a" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="mine">Apenas meus</SelectItem>
                  <SelectItem value="unassigned">Não atribuídos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-md">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Carregando monitoramento...
        </div>
      ) : (
        <>
          {viewMode === "kanban" ? (
            <MonitoramentoKanban
              items={filteredItems}
              onStatusChange={handleStatusChange}
              onOpenDetails={(i) => setSelectedItemId(i.id)}
            />
          ) : (
            <MonitoramentoListView
              items={filteredItems}
              onOpenDetails={(i) => setSelectedItemId(i.id)}
            />
          )}
        </>
      )}

      <MonitoramentoDetailsModal
        item={selectedItem}
        open={selectedItemId != null}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
        onUpdatePendingItems={handleUpdatePendingItems}
      />
    </div>
  );
}
