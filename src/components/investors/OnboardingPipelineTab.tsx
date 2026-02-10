import { useState } from "react";
import { Plus, LayoutList, LayoutGrid, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewCedenteModal } from "./NewCedenteModal";
import { OnboardingKanban } from "./OnboardingKanban";
import { OnboardingListView } from "./OnboardingListView";
import { useProspectionWorkflows } from "@/hooks/useProspection";
import type {
  ProspectionStatus,
  WorkflowFilters,
  ProspectionWorkflow,
} from "@/lib/api/prospectionService";

export function OnboardingPipelineTab() {
  const [showNewCedenteModal, setShowNewCedenteModal] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");

  // Build API filters (status and assigned_to go to the backend)
  const apiFilters: WorkflowFilters = {};
  if (statusFilter !== "all") {
    apiFilters.status = statusFilter as ProspectionStatus;
  }
  // "mine" and "unassigned" are handled client-side since the backend
  // filter is by exact name, not by a concept of "me"
  // We only pass assigned_to if we have a specific name (not implemented yet).

  const { data, isLoading, isError, error } = useProspectionWorkflows(apiFilters);

  // Client-side filtering for assigned and SLA
  const filteredWorkflows: ProspectionWorkflow[] = (data?.items ?? []).filter(
    (wf) => {
      // Assigned filter
      if (assignedFilter === "unassigned" && wf.assigned_to !== null)
        return false;
      // "mine" would require knowing the current user; skip for now
      // if (assignedFilter === "mine" && wf.assigned_to !== currentUser) return false;

      // SLA filter (client-side)
      if (slaFilter !== "all") {
        const now = new Date();
        const deadline = wf.sla_deadline ? new Date(wf.sla_deadline) : null;

        if (slaFilter === "within" && deadline) {
          const daysRemaining = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysRemaining <= 2) return false;
        }
        if (slaFilter === "approaching" && deadline) {
          const daysRemaining = Math.ceil(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysRemaining < 1 || daysRemaining > 2) return false;
        }
        if (slaFilter === "overdue" && deadline) {
          if (deadline.getTime() > now.getTime()) return false;
        }
      }

      return true;
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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
              <Button onClick={() => setShowNewCedenteModal(true)}>
                <Plus className="h-4 w-4" />
                Novo Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contact">Contato</SelectItem>
                  <SelectItem value="documents">Documentação</SelectItem>
                  <SelectItem value="credit_analysis">
                    Análise de Crédito
                  </SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Atribuído a
              </label>
              <Select
                value={assignedFilter}
                onValueChange={setAssignedFilter}
              >
                <SelectTrigger className="w-[200px]">
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
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="SLA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="within">Dentro do prazo</SelectItem>
                  <SelectItem value="approaching">
                    Próximo ao vencimento
                  </SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading / Error states */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Carregando workflows...
          </span>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">
            Erro ao carregar workflows: {error?.message}
          </p>
        </div>
      )}

      {/* View Content */}
      {!isLoading && !isError && (
        <>
          {viewMode === "kanban" ? (
            <OnboardingKanban workflows={filteredWorkflows} />
          ) : (
            <OnboardingListView workflows={filteredWorkflows} />
          )}
        </>
      )}

      <NewCedenteModal
        open={showNewCedenteModal}
        onOpenChange={setShowNewCedenteModal}
      />
    </div>
  );
}
