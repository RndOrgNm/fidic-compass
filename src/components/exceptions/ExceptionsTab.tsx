import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exceptionsData } from "@/data";
import { ExceptionCard } from "./ExceptionCard";
import { ExceptionDetailsModal } from "./ExceptionDetailsModal";
import { toast } from "@/hooks/use-toast";

export type Exception = {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  amount: number;
  description: string;
  transactionDate?: string;
  originName?: string;
  originCnpj?: string;
  receivableNumber?: string;
  debtorName?: string;
  dueDate?: string;
  daysOverdue?: number;
  amountDifference?: number;
  assignedTo: string | null;
  status: "pending" | "investigating" | "resolved" | "closed";
  daysOpen: number;
  createdAt: string;
};

export function ExceptionsTab() {
  const [exceptions, setExceptions] = useState<Exception[]>(exceptionsData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAssignToMe = (ids: string[]) => {
    setExceptions(prev => 
      prev.map(exc => 
        ids.includes(exc.id) ? { ...exc, assignedTo: "Maria Silva" } : exc
      )
    );
    setSelectedIds([]);
    toast({
      title: "Exceções atribuídas",
      description: `${ids.length} exceção(ões) atribuída(s) para você`,
    });
  };

  const handleViewDetails = (exception: Exception) => {
    setSelectedException(exception);
    setDetailsModalOpen(true);
  };

  const handleAddNote = (id: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Sistema de notas será implementado em breve",
    });
  };

  const handleResolve = (id: string, action: string) => {
    toast({
      title: "Ação registrada",
      description: `Exceção ${id}: ${action}`,
    });
  };

  // Filter exceptions
  const filteredExceptions = exceptions.filter(exc => {
    if (priorityFilter !== "all" && exc.priority !== priorityFilter) return false;
    if (typeFilter !== "all" && exc.type !== typeFilter) return false;
    if (statusFilter !== "all" && exc.status !== statusFilter) return false;
    if (assignmentFilter === "mine" && exc.assignedTo !== "Maria Silva") return false;
    if (assignmentFilter === "unassigned" && exc.assignedTo !== null) return false;
    return true;
  });

  // Sort by priority and days open
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedExceptions = [...filteredExceptions].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.daysOpen - a.daysOpen;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Prioridade</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="unmatched_transaction">Transação não identificada</SelectItem>
                  <SelectItem value="partial_payment">Pagamento parcial</SelectItem>
                  <SelectItem value="amount_difference">Diferença de valor</SelectItem>
                  <SelectItem value="unmatched_receivable">Recebível não pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="investigating">Investigando</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Atribuído a</label>
              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Atribuído a" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="mine">Apenas minhas</SelectItem>
                  <SelectItem value="unassigned">Não atribuídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            disabled={selectedIds.length === 0}
            onClick={() => handleAssignToMe(selectedIds)}
          >
            <UserPlus className="h-4 w-4" />
            Atribuir selecionadas para mim
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {sortedExceptions.length} de {exceptions.length} exceções
        </div>
      </div>

      {/* Exceptions List */}
      <div className="space-y-4">
        {sortedExceptions.map(exception => (
          <ExceptionCard
            key={exception.id}
            exception={exception}
            isSelected={selectedIds.includes(exception.id)}
            onToggleSelection={handleToggleSelection}
            onViewDetails={handleViewDetails}
            onAssignToMe={() => handleAssignToMe([exception.id])}
            onAddNote={handleAddNote}
            onResolve={handleResolve}
          />
        ))}

        {sortedExceptions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma exceção encontrada com os filtros aplicados
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedException && (
        <ExceptionDetailsModal
          exception={selectedException}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
        />
      )}
    </div>
  );
}
