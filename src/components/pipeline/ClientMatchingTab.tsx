import { useState } from "react";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchingKanban } from "./MatchingKanban";
import { MatchingListView } from "./MatchingListView";
import { matchingWorkflowsData, fundsData } from "@/data";

export function ClientMatchingTab() {
  const [workflows, setWorkflows] = useState(matchingWorkflowsData);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fundFilter, setFundFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [slaFilter, setSlaFilter] = useState("all");

  const filteredWorkflows = workflows.filter((wf) => {
    if (statusFilter !== "all" && wf.status !== statusFilter) return false;
    if (fundFilter !== "all" && wf.fundId !== fundFilter) return false;
    
    if (assignedFilter === "mine" && wf.assignedTo !== "Maria Silva") return false;
    if (assignedFilter === "unassigned" && wf.assignedTo !== null) return false;
    
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
            <CardTitle>Alocação em Fundos</CardTitle>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending_match">Aguardando Match</SelectItem>
                  <SelectItem value="fund_selection">Seleção de Fundo</SelectItem>
                  <SelectItem value="compliance_check">Verificação Compliance</SelectItem>
                  <SelectItem value="allocated">Alocado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fundo</label>
              <Select value={fundFilter} onValueChange={setFundFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Fundo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {fundsData.map((fund) => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.code}
                    </SelectItem>
                  ))}
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
        <MatchingKanban
          workflows={filteredWorkflows}
          setWorkflows={setWorkflows}
        />
      ) : (
        <MatchingListView workflows={filteredWorkflows} />
      )}
    </div>
  );
}
