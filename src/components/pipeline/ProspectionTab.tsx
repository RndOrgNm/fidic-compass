import { useState } from "react";
import { Plus, LayoutList, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewProspectionModal } from "./NewProspectionModal";
import { ProspectionKanban } from "./ProspectionKanban";
import { ProspectionListView } from "./ProspectionListView";
import { prospectionWorkflowsData } from "@/data";

export function ProspectionTab() {
  const [workflows, setWorkflows] = useState(prospectionWorkflowsData);
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const filteredWorkflows = workflows.filter((wf) => {
    if (statusFilter !== "all" && wf.status !== statusFilter) return false;
    
    if (assignedFilter === "mine" && wf.assignedTo !== "Maria Silva") return false;
    if (assignedFilter === "unassigned" && wf.assignedTo !== null) return false;
    
    if (segmentFilter !== "all" && wf.cedenteSegment !== segmentFilter) return false;
    
    if (slaFilter !== "all" && wf.slaDeadline) {
      const now = new Date();
      const deadline = new Date(wf.slaDeadline);
      const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (slaFilter === "within" && daysRemaining <= 2) return false;
      if (slaFilter === "approaching" && (daysRemaining < 1 || daysRemaining > 2)) return false;
      if (slaFilter === "overdue" && deadline.getTime() > now.getTime()) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline de Prospecção</CardTitle>
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
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="h-4 w-4" />
                Novo Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contact">Em Contato</SelectItem>
                  <SelectItem value="documents">Documentação</SelectItem>
                  <SelectItem value="credit_analysis">Análise de Crédito</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">SLA</label>
              <Select value={slaFilter} onValueChange={setSlaFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="SLA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="within">Dentro do prazo</SelectItem>
                  <SelectItem value="approaching">Próximo ao vencimento</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "kanban" ? (
        <ProspectionKanban
          workflows={filteredWorkflows}
          setWorkflows={setWorkflows}
        />
      ) : (
        <ProspectionListView workflows={filteredWorkflows} />
      )}

      <NewProspectionModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
      />
    </div>
  );
}
