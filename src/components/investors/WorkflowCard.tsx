import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, AlertTriangle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAssignWorkflow } from "@/hooks/useProspection";
import type { ProspectionWorkflow, Segment } from "@/lib/api/prospectionService";

interface WorkflowCardProps {
  workflow: ProspectionWorkflow;
}

const STEP_LABELS: Record<string, string> = {
  initial_contact: "Contato Inicial",
  proposal_sent: "Proposta Enviada",
  document_collection: "Coleta de Documentos",
  risk_assessment: "Avaliação de Risco",
  committee_review: "Revisão do Comitê",
  completed: "Concluído",
};

const SEGMENT_LABELS: Record<Segment, string> = {
  comercio: "Comércio",
  industria: "Indústria",
  servicos: "Serviços",
  agronegocio: "Agronegócio",
  varejo: "Varejo",
  insumos: "Insumos",
};

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: workflow.id,
  });

  const assignMutation = useAssignWorkflow();

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const formatCnpj = (cnpj: string) => {
    if (!cnpj) return "";
    if (cnpj.includes("/") || cnpj.includes(".")) return cnpj;
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const getProgressPercentage = () => {
    if (workflow.total_steps === 0) return 0;
    return Math.round((workflow.completed_steps / workflow.total_steps) * 100);
  };

  const getSLABadge = () => {
    if (!workflow.sla_deadline) return null;

    const now = new Date();
    const deadline = new Date(workflow.sla_deadline);
    const daysRemaining = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining > 2) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <Clock className="h-3 w-3 mr-1" />
          {daysRemaining} dias
        </Badge>
      );
    } else if (daysRemaining >= 1) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          {daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Atrasado
        </Badge>
      );
    }
  };

  const getSegmentBadge = () => {
    if (!workflow.cedente_segment) return null;
    const label = SEGMENT_LABELS[workflow.cedente_segment] || workflow.cedente_segment;
    return <Badge className="bg-indigo-100 text-indigo-800">{label}</Badge>;
  };

  const getStatusBorderClass = () => {
    switch (workflow.status) {
      case "lead":
        return "border-l-4 border-gray-500";
      case "contact":
        return "border-l-4 border-blue-500";
      case "documents":
        return "border-l-4 border-yellow-500";
      case "credit_analysis":
        return "border-l-4 border-purple-500";
      case "approved":
        return "border-l-4 border-green-500";
      case "rejected":
        return "border-l-4 border-red-500";
      default:
        return "";
    }
  };

  const handleAssignToMe = () => {
    // TODO: replace with actual logged-in user name
    const currentUser = "Usuário Atual";
    assignMutation.mutate(
      { workflowId: workflow.id, assignedTo: currentUser },
      {
        onSuccess: () => {
          toast({
            title: "Workflow atribuído",
            description: "Workflow atribuído com sucesso",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao atribuir workflow",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleOpenWorkflow = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Navegação para detalhes do workflow em desenvolvimento",
    });
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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">
                {workflow.cedente_name || "Sem nome"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {workflow.cedente_cnpj ? formatCnpj(workflow.cedente_cnpj) : "—"}
              </span>
              {getSegmentBadge()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {workflow.completed_steps} de {workflow.total_steps} etapas
            </span>
            <span className="font-medium">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="text-sm">
          <span className="text-muted-foreground">Etapa atual:</span>
          <div className="font-medium mt-1">
            {STEP_LABELS[workflow.current_step] || workflow.current_step}
          </div>
        </div>

        {/* Management Info */}
        <div className="flex flex-wrap gap-2 text-xs">
          {workflow.assigned_to ? (
            <Badge variant="outline">{workflow.assigned_to}</Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50">
              Não atribuído
            </Badge>
          )}
          <Badge variant="outline">{workflow.days_in_progress} dias</Badge>
          {getSLABadge()}
        </div>

        {/* Pending Items */}
        {workflow.pending_items && workflow.pending_items.length > 0 && (
          <div className="space-y-1">
            {workflow.pending_items.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        <Button size="sm" className="w-full" onClick={handleOpenWorkflow}>
          Abrir Workflow
        </Button>
        {!workflow.assigned_to && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleAssignToMe}
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending ? "Atribuindo..." : "Atribuir p/ Mim"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
