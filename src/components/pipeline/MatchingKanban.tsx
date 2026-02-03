import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { MatchingCard } from "./MatchingCard";
import { toast } from "@/hooks/use-toast";

interface MatchingKanbanProps {
  workflows: any[];
  setWorkflows: (workflows: any[]) => void;
}

const columns = [
  { id: "pending_match", title: "Aguardando Match", color: "border-slate-500" },
  { id: "fund_selection", title: "Seleção de Fundo", color: "border-blue-500" },
  { id: "compliance_check", title: "Verificação Compliance", color: "border-yellow-500" },
  { id: "allocated", title: "Alocado", color: "border-green-500" },
];

export function MatchingKanban({ workflows, setWorkflows }: MatchingKanbanProps) {
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
      description: `Recebível movido para ${columnTitle}`,
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
    return getWorkflowsByStatus(status).reduce((acc, wf) => acc + (wf.nominalValue || 0), 0);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <MatchingCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
