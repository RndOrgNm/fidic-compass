import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { GripVertical, Building2, User, Mail, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CedentePipelineStatus } from "@/data/pipelineData";

export interface CedentePipelineItem {
  id: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  segment: string;
  creditScore: number;
  status: CedentePipelineStatus;
  totalReceivables: number;
  approvedLimit: number;
  createdAt: string;
  assigned_to: string | null;
  pending_items: string[];
  days_in_status: number;
}

interface CedenteCardProps {
  cedente: CedentePipelineItem;
  checklist: Record<string, string[]>;
  onOpenDetails?: (cedente: CedentePipelineItem) => void;
}

function formatCnpj(cnpj: string) {
  if (!cnpj) return "—";
  if (cnpj.includes("/") || cnpj.includes(".")) return cnpj;
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const SEGMENT_LABELS: Record<string, string> = {
  comercio: "Comércio",
  industria: "Indústria",
  servicos: "Serviços",
  agronegocio: "Agronegócio",
  varejo: "Varejo",
  insumos: "Insumos",
};

export function CedenteCard({ cedente, checklist, onOpenDetails }: CedenteCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cedente.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const getStatusBorderClass = () => {
    switch (cedente.status) {
      case "lead":
        return "border-l-4 border-slate-500";
      case "due_diligence":
        return "border-l-4 border-blue-500";
      case "documentacao_pendente":
        return "border-l-4 border-yellow-500";
      case "cedente_ativo":
        return "border-l-4 border-green-500";
      case "bloqueado_desistencia":
        return "border-l-4 border-red-500";
      default:
        return "";
    }
  };

  const handleOpenDetails = () => {
    onOpenDetails?.(cedente);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-move hover:shadow-lg transition-shadow",
        getStatusBorderClass(),
        isDragging && "opacity-50"
      )}
    >
      <CardHeader className="pb-3">
        <div
          {...listeners}
          {...attributes}
          className="flex items-start justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-semibold truncate">{cedente.companyName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
          <Building2 className="h-3 w-3 flex-shrink-0" />
          <span>{formatCnpj(cedente.cnpj)}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm truncate">{cedente.contactName}</span>
        </div>
        {cedente.contactEmail && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{cedente.contactEmail}</span>
          </div>
        )}
        <div>
          <Badge variant="secondary" className="text-xs">
            {SEGMENT_LABELS[cedente.segment] ?? cedente.segment}
          </Badge>
        </div>
        {cedente.creditScore > 0 && (
          <p className="text-xs text-muted-foreground">
            Score: <span className="font-medium text-foreground">{cedente.creditScore}</span>
          </p>
        )}
        {(cedente.totalReceivables > 0 || cedente.approvedLimit > 0) && (
          <div className="text-xs text-muted-foreground space-y-0.5">
            {cedente.totalReceivables > 0 && (
              <p>Recebíveis: {formatCurrency(cedente.totalReceivables)}</p>
            )}
            {cedente.approvedLimit > 0 && (
              <p>Limite aprovado: {formatCurrency(cedente.approvedLimit)}</p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs pt-1">
          {cedente.assigned_to ? (
            <Badge variant="outline">{cedente.assigned_to}</Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50">
              Não atribuído
            </Badge>
          )}
          <Badge variant="outline">{cedente.days_in_status} dias</Badge>
          {(cedente.pending_items?.length ?? 0) > 0 && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <button type="button" className="cursor-help">
                    <Badge className="bg-red-100 text-red-800 pointer-events-none">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {cedente.pending_items.length} de {checklist[cedente.status]?.length ?? cedente.pending_items.length}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[320px]">
                  <p className="font-medium mb-1.5">
                    Checklist — {cedente.pending_items.length} pendente{cedente.pending_items.length !== 1 ? "s" : ""} (bloqueia avanço)
                  </p>
                  <ul className="text-sm space-y-1.5">
                    {(checklist[cedente.status] ?? []).map((item, idx) => {
                      const isPending = cedente.pending_items.includes(item);
                      return (
                        <li key={idx} className={cn("flex items-start gap-1.5", isPending ? "text-foreground" : "text-muted-foreground")}>
                          <span className={isPending ? "text-red-500 mt-0.5" : "text-green-600 mt-0.5"}>
                            {isPending ? "○" : "✓"}
                          </span>
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button size="sm" className="w-full" onClick={handleOpenDetails}>
          Abrir Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
