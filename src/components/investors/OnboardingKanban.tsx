import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { WorkflowCard } from "./WorkflowCard";
import { toast } from "@/hooks/use-toast";
import { useTransitionWorkflow } from "@/hooks/useProspection";
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

export function OnboardingKanban({ workflows }: OnboardingKanbanProps) {
  const transitionMutation = useTransitionWorkflow();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const workflowId = active.id as string;
    const newStatus = over.id as ProspectionStatus;

    transitionMutation.mutate(
      { workflowId, data: { status: newStatus } },
      {
        onSuccess: () => {
          const columnTitle = columns.find((c) => c.id === newStatus)?.title || newStatus;
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
        {columns.map((column) => {
          const columnWorkflows = getWorkflowsByStatus(column.id);
          return (
            <div
              key={column.id}
              className={`space-y-4 border-t-4 ${column.color} rounded-t-md bg-muted/30 p-4 min-h-[600px]`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="secondary">{columnWorkflows.length}</Badge>
              </div>
              <div className="space-y-3">
                {columnWorkflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
