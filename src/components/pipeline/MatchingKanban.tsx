import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { MatchingCard } from "./MatchingCard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTransitionAllocationWorkflow } from "@/hooks/useAllocation";
import type { AllocationWorkflow, AllocationStatus } from "@/lib/api/allocationService";

interface MatchingKanbanProps {
  workflows: AllocationWorkflow[];
}

const columns = [
  { id: "pending_match", title: "Aguardando Match", color: "border-slate-500" },
  { id: "fund_selection", title: "Seleção de Fundo", color: "border-blue-500" },
  { id: "compliance_check", title: "Verificação Compliance", color: "border-yellow-500" },
  { id: "allocated", title: "Alocado", color: "border-green-500" },
];

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  workflows: AllocationWorkflow[];
  totalValue: string;
}

function KanbanColumn({ id, title, color, workflows, totalValue }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-4 border-t-4 rounded-t-md bg-muted/30 p-4 min-h-[600px] transition-colors",
        color,
        isOver && "bg-primary/10 ring-2 ring-primary/30"
      )}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary">{workflows.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{totalValue}</p>
      </div>
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <MatchingCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}

export function MatchingKanban({ workflows }: MatchingKanbanProps) {
  const transitionMutation = useTransitionAllocationWorkflow();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const workflowId = active.id as string;
    const targetColumnId = over.id as string;

    const draggedWorkflow = workflows.find((wf) => wf.id === workflowId);
    if (!draggedWorkflow || draggedWorkflow.status === targetColumnId) return;

    transitionMutation.mutate(
      { workflowId, data: { status: targetColumnId as AllocationStatus } },
      {
        onSuccess: () => {
          const columnTitle = columns.find((c) => c.id === targetColumnId)?.title || targetColumnId;
          toast({
            title: "Workflow movido",
            description: `Recebível movido para ${columnTitle}`,
          });
        },
        onError: (err) => {
          toast({
            title: "Erro ao mover",
            description: err instanceof Error ? err.message : "Não foi possível mover o workflow",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getWorkflowsByStatus = (status: string) => {
    return workflows.filter((wf) => wf.status === status);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTotalValue = (status: string) => {
    return getWorkflowsByStatus(status).reduce((acc, wf) => acc + (wf.nominal_value || 0), 0);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            workflows={getWorkflowsByStatus(column.id)}
            totalValue={formatCurrency(getTotalValue(column.id))}
          />
        ))}
      </div>
    </DndContext>
  );
}

