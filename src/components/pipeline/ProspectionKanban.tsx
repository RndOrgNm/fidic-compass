import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { ProspectionCard } from "./ProspectionCard";
import { toast } from "@/hooks/use-toast";

interface ProspectionKanbanProps {
  workflows: any[];
  setWorkflows: (workflows: any[]) => void;
}

const columns = [
  { id: "lead", title: "Lead", color: "border-slate-500" },
  { id: "contact", title: "Em Contato", color: "border-blue-500" },
  { id: "documents", title: "Documentação", color: "border-yellow-500" },
  { id: "credit_analysis", title: "Análise de Crédito", color: "border-purple-500" },
  { id: "approved", title: "Aprovado", color: "border-green-500" },
];

export function ProspectionKanban({ workflows, setWorkflows }: ProspectionKanbanProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const workflowId = active.id as string;
    const newStatus = over.id as string;

    setWorkflows(
      workflows.map((wf) =>
        wf.id === workflowId ? { ...wf, status: newStatus } : wf
      )
    );

    const columnTitle = columns.find((c) => c.id === newStatus)?.title || newStatus;
    toast({
      title: "Workflow movido",
      description: `Workflow movido para ${columnTitle}`,
    });
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
    return getWorkflowsByStatus(status).reduce((acc, wf) => acc + (wf.estimatedVolume || 0), 0);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnWorkflows = getWorkflowsByStatus(column.id);
          const totalValue = getTotalValue(column.id);
          return (
            <div
              key={column.id}
              className={`space-y-4 border-t-4 ${column.color} rounded-t-md bg-muted/30 p-4 min-h-[600px]`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">{columnWorkflows.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="space-y-3">
                {columnWorkflows.map((workflow) => (
                  <ProspectionCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
