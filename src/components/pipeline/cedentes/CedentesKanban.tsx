import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { CedenteCard, type CedentePipelineItem } from "./CedenteCard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { CedentePipelineStatus } from "@/data/pipelineData";

const COLUMNS: { id: CedentePipelineStatus; title: string; color: string }[] = [
  { id: "lead", title: "Lead", color: "border-slate-500" },
  { id: "due_diligence", title: "Due Diligence", color: "border-blue-500" },
  { id: "documentacao_pendente", title: "Documentação Pendente", color: "border-yellow-500" },
  { id: "cedente_ativo", title: "Cedente Ativo", color: "border-green-500" },
  { id: "bloqueado_desistencia", title: "Bloqueado/Desistência", color: "border-red-500" },
];

interface CedentesKanbanProps {
  cedentes: CedentePipelineItem[];
  checklist: Record<string, string[]>;
  onStatusChange: (cedenteId: string, newStatus: CedentePipelineStatus) => void;
  onOpenDetails: (cedente: CedentePipelineItem) => void;
}

interface KanbanColumnProps {
  id: CedentePipelineStatus;
  title: string;
  color: string;
  cedentes: CedentePipelineItem[];
  checklist: Record<string, string[]>;
  onOpenDetails: (cedente: CedentePipelineItem) => void;
}

function KanbanColumn({ id, title, color, cedentes, checklist, onOpenDetails }: KanbanColumnProps) {
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
          <Badge variant="secondary">{cedentes.length}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        {cedentes.map((cedente) => (
          <CedenteCard key={cedente.id} cedente={cedente} checklist={checklist} onOpenDetails={onOpenDetails} />
        ))}
      </div>
    </div>
  );
}

/**
 * Kanban pattern: a card can only move to the next status when it has no pending items.
 * Backend will enforce the same rule via pending_items on the cedente/workflow.
 */
export function CedentesKanban({ cedentes, checklist, onStatusChange, onOpenDetails }: CedentesKanbanProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cedenteId = active.id as string;
    const targetStatus = over.id as CedentePipelineStatus;

    const cedente = cedentes.find((c) => c.id === cedenteId);
    if (!cedente || cedente.status === targetStatus) return;

    const hasPending = (cedente.pending_items?.length ?? 0) > 0;
    if (hasPending) {
      toast({
        title: "Itens pendentes",
        description: "Complete os itens pendentes antes de mover o cedente para outra etapa.",
        variant: "destructive",
      });
      return;
    }

    onStatusChange(cedenteId, targetStatus);
  };

  const getCedentesByStatus = (status: CedentePipelineStatus) =>
    cedentes.filter((c) => c.status === status);

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            cedentes={getCedentesByStatus(col.id)}
            checklist={checklist}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </DndContext>
  );
}
