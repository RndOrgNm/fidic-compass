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
import { monitoramentoPipelineData } from "@/data";

const CURRENT_USER_PLACEHOLDER = "Maria Silva";

export function MonitoramentoTab() {
  const [items, setItems] = useState<MonitoramentoPipelineItem[]>(monitoramentoPipelineData);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setItems([...monitoramentoPipelineData]);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleStatusChange = (itemId: string, newStatus: MonitoramentoPipelineStatus) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i))
    );
  };

  const handleUpdatePendingItems = (itemId: string, pendingItems: string[]) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, pending_items: pendingItems } : i))
    );
  };

  const selectedItem = items.find((i) => i.id === selectedItemId) ?? null;

  const filteredItems = items.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (assignedFilter === "mine" && i.assigned_to !== CURRENT_USER_PLACEHOLDER) return false;
    if (assignedFilter === "unassigned" && i.assigned_to != null) return false;
    return true;
  });

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
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
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

      <MonitoramentoDetailsModal
        item={selectedItem}
        open={selectedItemId != null}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
        onUpdatePendingItems={handleUpdatePendingItems}
      />
    </div>
  );
}
