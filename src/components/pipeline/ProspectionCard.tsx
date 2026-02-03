import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, AlertTriangle, GripVertical, Building2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ProspectionCardProps {
  workflow: any;
}

export function ProspectionCard({ workflow }: ProspectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: workflow.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProgressPercentage = () => {
    return Math.round((workflow.completedSteps / workflow.totalSteps) * 100);
  };

  const getSLABadge = () => {
    if (!workflow.slaDeadline) return null;

    const now = new Date();
    const deadline = new Date(workflow.slaDeadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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

  const getSegmentBadge = (segment: string) => {
    const segments: Record<string, { label: string; className: string }> = {
      comercio: { label: "Comércio", className: "bg-blue-100 text-blue-800" },
      industria: { label: "Indústria", className: "bg-purple-100 text-purple-800" },
      servicos: { label: "Serviços", className: "bg-cyan-100 text-cyan-800" },
      agronegocio: { label: "Agro", className: "bg-green-100 text-green-800" },
      varejo: { label: "Varejo", className: "bg-orange-100 text-orange-800" },
    };
    const seg = segments[segment] || { label: segment, className: "bg-gray-100 text-gray-800" };
    return <Badge className={seg.className}>{seg.label}</Badge>;
  };

  const getStatusBorderClass = () => {
    switch (workflow.status) {
      case "lead":
        return "border-l-4 border-slate-500";
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
    toast({
      title: "Workflow atribuído",
      description: "Workflow atribuído com sucesso",
    });
  };

  const handleOpenWorkflow = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Detalhes do workflow serão implementados em breve",
    });
  };

  const getCurrentStepLabel = () => {
    const steps: Record<string, string> = {
      initial_contact: "Contato inicial",
      proposal_sent: "Proposta enviada",
      document_collection: "Coleta de documentos",
      risk_assessment: "Avaliação de risco",
      committee_review: "Revisão do comitê",
      completed: "Concluído",
    };
    return steps[workflow.currentStep] || workflow.currentStep;
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold truncate">{workflow.cedenteName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatCnpj(workflow.cedenteCnpj)}
              </span>
            </div>
          </div>
          {getSegmentBadge(workflow.cedenteSegment)}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {workflow.estimatedVolume > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatCurrency(workflow.estimatedVolume)}</span>
            <span className="text-xs text-muted-foreground">volume estimado</span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {workflow.completedSteps} de {workflow.totalSteps} etapas
            </span>
            <span className="font-medium">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Etapa atual:</span>
          <div className="font-medium mt-1">{getCurrentStepLabel()}</div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {workflow.assignedTo ? (
            <Badge variant="outline">{workflow.assignedTo}</Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50">
              Não atribuído
            </Badge>
          )}
          <Badge variant="outline">{workflow.daysInProgress} dias</Badge>
          {getSLABadge()}
        </div>

        {workflow.pendingItems && workflow.pendingItems.length > 0 && (
          <div className="space-y-1">
            {workflow.pendingItems.slice(0, 2).map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
            {workflow.pendingItems.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{workflow.pendingItems.length - 2} pendências
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        <Button size="sm" className="w-full" onClick={handleOpenWorkflow}>
          Abrir Detalhes
        </Button>
        {!workflow.assignedTo && (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleAssignToMe}
          >
            Atribuir p/ Mim
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
