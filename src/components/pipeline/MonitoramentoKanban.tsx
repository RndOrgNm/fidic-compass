import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { MonitoramentoCard, type MonitoramentoPipelineItem } from "./MonitoramentoCard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { MonitoramentoPipelineStatus } from "@/data/pipelineData";

const COLUMNS: { id: MonitoramentoPipelineStatus; title: string; color: string }[] = [
  { id: "alertas_deteccao", title: "Alertas Detecção", color: "border-amber-500" },
  { id: "correcoes_acoes", title: "Correções/Ações", color: "border-orange-500" },
  { id: "relatorios_em_andamento", title: "Relatórios em Andamento", color: "border-blue-500" },
  { id: "em_conformidade_auditoria", title: "Em conformidade/Auditoria", color: "border-purple-500" },
  { id: "encerrado", title: "Encerrado", color: "border-green-500" },
];

interface MonitoramentoKanbanProps {
  items: MonitoramentoPipelineItem[];
  onStatusChange: (itemId: string, newStatus: MonitoramentoPipelineStatus) => void;
  onOpenDetails: (item: MonitoramentoPipelineItem) => void;
}

interface KanbanColumnProps {
  id: MonitoramentoPipelineStatus;
  title: string;
  color: string;
  items: MonitoramentoPipelineItem[];
  onOpenDetails: (item: MonitoramentoPipelineItem) => void;
}

function KanbanColumn({ id, title, color, items, onOpenDetails }: KanbanColumnProps) {
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
          <Badge variant="secondary">{items.length}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <MonitoramentoCard key={item.id} item={item} onOpenDetails={onOpenDetails} />
        ))}
      </div>
    </div>
  );
}

/**
 * Kanban pattern: card can only move when pending_items is empty.
 */
export function MonitoramentoKanban({ items, onStatusChange, onOpenDetails }: MonitoramentoKanbanProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const targetStatus = over.id as MonitoramentoPipelineStatus;

    const item = items.find((i) => i.id === itemId);
    if (!item || item.status === targetStatus) return;

    const hasPending = (item.pending_items?.length ?? 0) > 0;
    if (hasPending) {
      toast({
        title: "Itens pendentes",
        description: "Complete os itens pendentes antes de mover para outra etapa.",
        variant: "destructive",
      });
      return;
    }

    onStatusChange(itemId, targetStatus);
  };

  const getItemsByStatus = (status: MonitoramentoPipelineStatus) =>
    items.filter((i) => i.status === status);

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            items={getItemsByStatus(col.id)}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </DndContext>
  );
}
