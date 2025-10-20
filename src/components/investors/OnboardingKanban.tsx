import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { WorkflowCard } from "./WorkflowCard";
import { toast } from "@/hooks/use-toast";

interface OnboardingKanbanProps {
  workflows: any[];
  setWorkflows: (workflows: any[]) => void;
}

const columns = [
  { id: "started", title: "Iniciado", color: "border-blue-500" },
  { id: "documents_pending", title: "Documentação", color: "border-yellow-500" },
  { id: "compliance_review", title: "Análise de Compliance", color: "border-purple-500" },
  { id: "approved", title: "Aprovado", color: "border-green-500" },
];

export function OnboardingKanban({ workflows, setWorkflows }: OnboardingKanbanProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const workflowId = active.id as string;
    const newStatus = over.id as string;

    setWorkflows(
      workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, workflowStatus: newStatus } : wf
      )
    );

    const columnTitle = columns.find((c) => c.id === newStatus)?.title || newStatus;
    toast({
      title: "Workflow movido",
      description: `Workflow movido para ${columnTitle}`,
    });
  };

  const getWorkflowsByStatus = (status: string) => {
    return workflows.filter((wf) => wf.workflowStatus === status);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnWorkflows = getWorkflowsByStatus(column.id);
          return (
            <div
              key={column.id}
              className={`space-y-4 border-t-4 ${column.color} rounded-t-md bg-muted/30 p-4 min-h-[600px]`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{column.title}</h3>
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
