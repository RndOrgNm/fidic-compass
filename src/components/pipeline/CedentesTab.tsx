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
import { CedenteDetailsModal } from "./CedenteDetailsModal";
import type { CedentePipelineItem } from "./CedenteCard";
import type { CedentePipelineStatus } from "@/data/pipelineData";
import { useCedentes, useUpdateCedente } from "@/hooks/useCedentes";
import { toast } from "@/hooks/use-toast";
import type { CedenteStatus, Segment } from "@/lib/api/cedenteService";

const CURRENT_USER_PLACEHOLDER = "Maria Silva";

export function CedentesTab() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [showNewCedenteModal, setShowNewCedenteModal] = useState(false);
  const [selectedCedenteId, setSelectedCedenteId] = useState<string | null>(null);

  const filters: { status?: CedenteStatus; segment?: Segment } = {};
  if (statusFilter !== "all") filters.status = statusFilter as CedenteStatus;
  if (segmentFilter !== "all") filters.segment = segmentFilter as Segment;

  const { data, isLoading, error, refetch, isRefetching } = useCedentes(filters);
  const updateCedente = useUpdateCedente();

  const cedentes = data?.items ?? [];
  const filteredCedentes = cedentes.filter((c) => {
    if (assignedFilter === "mine" && c.assigned_to !== CURRENT_USER_PLACEHOLDER) return false;
    if (assignedFilter === "unassigned" && c.assigned_to != null) return false;
    return true;
  });

  const handleRefresh = () => refetch();

  const handleStatusChange = async (cedenteId: string, newStatus: CedentePipelineStatus) => {
    try {
      await updateCedente.mutateAsync({
        id: cedenteId,
        payload: {
          status: newStatus,
          status_started_at: new Date().toISOString(),
        },
      });
      const columnTitle =
        { lead: "Lead", due_diligence: "Due Diligence", documentacao_pendente: "Documentação Pendente", cedente_ativo: "Cedente Ativo", bloqueado_desistencia: "Bloqueado/Desistência" }[
          newStatus
        ] ?? newStatus;
      toast({ title: "Cedente movido", description: `Movido para ${columnTitle}` });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível mover o cedente.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePendingItems = async (cedenteId: string, pendingItems: string[]) => {
    try {
      await updateCedente.mutateAsync({
        id: cedenteId,
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

  const selectedCedente = filteredCedentes.find((c) => c.id === selectedCedenteId) ?? null;

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
                disabled={isRefetching}
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
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
          Carregando cedentes...
        </div>
      ) : (
        <>
          {viewMode === "kanban" ? (
            <CedentesKanban
              cedentes={filteredCedentes}
              onStatusChange={handleStatusChange}
              onOpenDetails={(c) => setSelectedCedenteId(c.id)}
            />
          ) : (
            <CedentesListView
              cedentes={filteredCedentes}
              onOpenDetails={(c) => setSelectedCedenteId(c.id)}
            />
          )}
        </>
      )}

      <CedenteDetailsModal
        cedente={selectedCedente}
        open={selectedCedenteId != null}
        onOpenChange={(open) => !open && setSelectedCedenteId(null)}
        onUpdatePendingItems={handleUpdatePendingItems}
      />

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
