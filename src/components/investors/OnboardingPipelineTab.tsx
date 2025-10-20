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
import { NewInvestorModal } from "./NewInvestorModal";
import { OnboardingKanban } from "./OnboardingKanban";
import { OnboardingListView } from "./OnboardingListView";
import { onboardingWorkflowsData } from "@/data/mockData";

export function OnboardingPipelineTab() {
  const [workflows, setWorkflows] = useState(onboardingWorkflowsData);
  const [showNewInvestorModal, setShowNewInvestorModal] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");

  const filteredWorkflows = workflows.filter((wf) => {
    if (statusFilter !== "all" && wf.workflowStatus !== statusFilter) return false;
    
    if (assignedFilter === "mine" && wf.assignedTo !== "Maria Silva") return false;
    if (assignedFilter === "unassigned" && wf.assignedTo !== null) return false;
    
    if (slaFilter !== "all") {
      const now = new Date();
      const deadline = wf.slaDeadline ? new Date(wf.slaDeadline) : null;
      
      if (slaFilter === "within" && deadline) {
        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 2) return false;
      }
      if (slaFilter === "approaching" && deadline) {
        const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 1 || daysRemaining > 2) return false;
      }
      if (slaFilter === "overdue" && deadline) {
        if (deadline.getTime() > now.getTime()) return false;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline de Onboarding</CardTitle>
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
              <Button onClick={() => setShowNewInvestorModal(true)}>
                <Plus className="h-4 w-4" />
                Novo Onboarding
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="started">Iniciado</SelectItem>
                  <SelectItem value="documents_pending">Docs Pendentes</SelectItem>
                  <SelectItem value="compliance_review">Em Análise</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Atribuído a</label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
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
                  <SelectItem value="approaching">Próximo ao vencimento</SelectItem>
                  <SelectItem value="overdue">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Content */}
      {viewMode === "kanban" ? (
        <OnboardingKanban
          workflows={filteredWorkflows}
          setWorkflows={setWorkflows}
        />
      ) : (
        <OnboardingListView workflows={filteredWorkflows} />
      )}

      <NewInvestorModal
        open={showNewInvestorModal}
        onOpenChange={setShowNewInvestorModal}
      />
    </div>
  );
}
