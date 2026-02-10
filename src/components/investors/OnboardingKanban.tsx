import { DndContext, DragEndEvent, DragOverlay, closestCorners, useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { WorkflowCard } from "./WorkflowCard";
import { toast } from "@/hooks/use-toast";
import { useTransitionWorkflow } from "@/hooks/useProspection";
import { cn } from "@/lib/utils";
import type { ProspectionWorkflow, ProspectionStatus } from "@/lib/api/prospectionService";

interface OnboardingKanbanProps {
  workflows: ProspectionWorkflow[];
}

const columns: { id: ProspectionStatus; title: string; color: string }[] = [
  { id: "lead", title: "Lead", color: "border-gray-500" },
  { id: "contact", title: "Contato", color: "border-blue-500" },
  { id: "documents", title: "Documentação", color: "border-yellow-500" },
  { id: "credit_analysis", title: "Análise de Crédito", color: "border-purple-500" },
  { id: "approved", title: "Aprovado", color: "border-green-500" },
  { id: "rejected", title: "Rejeitado", color: "border-red-500" },
];

// ── Droppable column component ─────────────────────────────────────────────────

interface KanbanColumnProps {
  id: ProspectionStatus;
  title: string;
  color: string;
  workflows: ProspectionWorkflow[];
}

function KanbanColumn({ id, title, color, workflows }: KanbanColumnProps) {
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="secondary">{workflows.length}</Badge>
      </div>
      <div className="space-y-3">
        {workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}

// ── Kanban board ───────────────────────────────────────────────────────────────

export function OnboardingKanban({ workflows }: OnboardingKanbanProps) {
  const transitionMutation = useTransitionWorkflow();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const workflowId = active.id as string;
    const targetColumnId = over.id as ProspectionStatus;

    // Find the workflow being dragged to check its current status
    const draggedWorkflow = workflows.find((wf) => wf.id === workflowId);
    if (!draggedWorkflow || draggedWorkflow.status === targetColumnId) return;

    transitionMutation.mutate(
      { workflowId, data: { status: targetColumnId } },
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

  const getWorkflowsByStatus = (status: ProspectionStatus) => {
    return workflows.filter((wf) => wf.status === status);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            workflows={getWorkflowsByStatus(column.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
