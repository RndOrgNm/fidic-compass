import { useState } from "react";
import { LayoutList, LayoutGrid, RefreshCw, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CedentesKanban } from "./CedentesKanban";
import { CedentesListView } from "./CedentesListView";
import type { CedentePipelineItem } from "./CedenteCard";
import type { CedentePipelineStatus } from "@/data/pipelineData";
import { cedentesPipelineData } from "@/data";

export function CedentesTab() {
  const [cedentes, setCedentes] = useState<CedentePipelineItem[]>(cedentesPipelineData);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewCedenteModal, setShowNewCedenteModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCedentes([...cedentesPipelineData]);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleStatusChange = (cedenteId: string, newStatus: CedentePipelineStatus) => {
    setCedentes((prev) =>
      prev.map((c) => (c.id === cedenteId ? { ...c, status: newStatus } : c))
    );
  };

  const filteredCedentes = cedentes.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (segmentFilter !== "all" && c.segment !== segmentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cedentes</CardTitle>
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
              <Button onClick={() => setShowNewCedenteModal(true)}>
                <Plus className="h-4 w-4" />
                Novo Cedente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="due_diligence">Due Diligence</SelectItem>
                  <SelectItem value="documentacao_pendente">Documentação Pendente</SelectItem>
                  <SelectItem value="cedente_ativo">Cedente Ativo</SelectItem>
                  <SelectItem value="bloqueado_desistencia">Bloqueado/Desistência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Segmento</label>
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="comercio">Comércio</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="agronegocio">Agronegócio</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="insumos">Insumos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "kanban" ? (
        <CedentesKanban cedentes={filteredCedentes} onStatusChange={handleStatusChange} />
      ) : (
        <CedentesListView cedentes={filteredCedentes} />
      )}

      <Dialog open={showNewCedenteModal} onOpenChange={setShowNewCedenteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cedente</DialogTitle>
            <DialogDescription>
              O formulário de novo cedente será implementado em breve (integração com o backend).
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
