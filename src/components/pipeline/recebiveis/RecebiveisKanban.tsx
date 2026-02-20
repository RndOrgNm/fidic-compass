import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { RecebiveisCard } from "./RecebiveisCard";
import { toast } from "@/hooks/use-toast";
import { useTransitionRecebivel } from "@/hooks/useRecebiveis";
import { cn } from "@/lib/utils";
import type { Recebivel, ProspectionStatus } from "@/lib/api/recebiveisService";

interface RecebiveisKanbanProps {
  recebiveis: Recebivel[];
}

const columns: { id: ProspectionStatus; title: string; color: string }[] = [
  { id: "lead", title: "Lead", color: "border-slate-500" },
  { id: "contact", title: "Em Contato", color: "border-blue-500" },
  { id: "documents", title: "Documentação", color: "border-yellow-500" },
  { id: "credit_analysis", title: "Análise de Crédito", color: "border-purple-500" },
  { id: "approved", title: "Aprovado", color: "border-green-500" },
  { id: "rejected", title: "Rejeitado", color: "border-red-500" },
];

// ── Droppable column ───────────────────────────────────────────────────────────

interface KanbanColumnProps {
  id: ProspectionStatus;
  title: string;
  color: string;
  recebiveis: Recebivel[];
  totalValue: string;
}

function KanbanColumn({ id, title, color, recebiveis, totalValue }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-4 border-t-4 rounded-t-md bg-muted/30 p-4 min-h-[600px] min-w-[260px] w-[260px] flex-shrink-0 transition-colors",
        color,
        isOver && "bg-primary/10 ring-2 ring-primary/30"
      )}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary">{recebiveis.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{totalValue}</p>
      </div>
      <div className="space-y-3">
        {recebiveis.map((r) => (
          <RecebiveisCard key={r.id} recebivel={r} />
        ))}
      </div>
    </div>
  );
}

// ── Kanban board ───────────────────────────────────────────────────────────────

export function RecebiveisKanban({ recebiveis }: RecebiveisKanbanProps) {
  const transitionMutation = useTransitionRecebivel();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const recebivelId = active.id as string;
    const targetColumnId = over.id as ProspectionStatus;

    const dragged = recebiveis.find((r) => r.id === recebivelId);
    if (!dragged || dragged.status === targetColumnId) return;

    transitionMutation.mutate(
      { recebivelId, data: { status: targetColumnId } },
      {
        onSuccess: () => {
          const columnTitle =
            columns.find((c) => c.id === targetColumnId)?.title || targetColumnId;
          toast({
            title: "Workflow movido",
            description: `Workflow movido para ${columnTitle}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao mover workflow",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const getRecebiveisByStatus = (status: ProspectionStatus) => {
    return recebiveis.filter((r) => r.status === status);
  };

  const getTotalValue = (status: ProspectionStatus) => {
    return getRecebiveisByStatus(status).reduce(
      (acc, r) => acc + (r.estimated_volume || r.receivable_value || 0),
      0
    );
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            recebiveis={getRecebiveisByStatus(column.id)}
            totalValue={formatCurrency(getTotalValue(column.id))}
          />
        ))}
      </div>
    </DndContext>
  );
}
