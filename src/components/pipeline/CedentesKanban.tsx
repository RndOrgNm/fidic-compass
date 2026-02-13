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
  onStatusChange: (cedenteId: string, newStatus: CedentePipelineStatus) => void;
}

interface KanbanColumnProps {
  id: CedentePipelineStatus;
  title: string;
  color: string;
  cedentes: CedentePipelineItem[];
}

function KanbanColumn({ id, title, color, cedentes }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-4 border-t-4 rounded-t-md bg-muted/30 p-4 min-h-[500px] min-w-[240px] flex-shrink-0 transition-colors",
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
          <CedenteCard key={cedente.id} cedente={cedente} />
        ))}
      </div>
    </div>
  );
}

export function CedentesKanban({ cedentes, onStatusChange }: CedentesKanbanProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cedenteId = active.id as string;
    const targetStatus = over.id as CedentePipelineStatus;

    const cedente = cedentes.find((c) => c.id === cedenteId);
    if (!cedente || cedente.status === targetStatus) return;

    onStatusChange(cedenteId, targetStatus);

    const columnTitle = COLUMNS.find((c) => c.id === targetStatus)?.title ?? targetStatus;
    toast({
      title: "Cedente movido",
      description: `Movido para ${columnTitle}`,
    });
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
          />
        ))}
      </div>
    </DndContext>
  );
}
