import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, AlertTriangle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface WorkflowCardProps {
  workflow: any;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: workflow.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const formatTaxId = (taxId: string) => {
    if (taxId.includes("-")) {
      return taxId;
    }
    return taxId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
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

  const getTypeBadge = (type: string) => {
    if (type === "individual") {
      return <Badge className="bg-blue-100 text-blue-800">PF</Badge>;
    }
    return <Badge className="bg-purple-100 text-purple-800">PJ</Badge>;
  };

  const getStatusBorderClass = () => {
    switch (workflow.workflowStatus) {
      case "started":
        return "border-l-4 border-blue-500";
      case "documents_pending":
        return "border-l-4 border-yellow-500";
      case "compliance_review":
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
              <span className="font-semibold">{workflow.investorName}</span>
              {getTypeBadge(workflow.investorType)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTaxId(workflow.investorTaxId)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {workflow.completedSteps} de {workflow.totalSteps} etapas
            </span>
            <span className="font-medium">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Current Step */}
        <div className="text-sm">
          <span className="text-muted-foreground">Etapa atual:</span>
          <div className="font-medium mt-1">
            {workflow.currentStep === "basic_information" && "Dados cadastrais"}
            {workflow.currentStep === "upload_documents" && "Upload de documentos"}
            {workflow.currentStep === "compliance_analysis" && "Análise de compliance"}
            {workflow.currentStep === "completed" && "Concluído"}
            {!["basic_information", "upload_documents", "compliance_analysis", "completed"].includes(
              workflow.currentStep
            ) && workflow.currentStep}
          </div>
        </div>

        {/* Management Info */}
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

        {/* Pending Items */}
        {workflow.pendingItems && workflow.pendingItems.length > 0 && (
          <div className="space-y-1">
            {workflow.pendingItems.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Reason */}
        {workflow.rejectionReason && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
            <div className="font-medium mb-1">Motivo da rejeição:</div>
            {workflow.rejectionReason}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        <Button size="sm" className="w-full" onClick={handleOpenWorkflow}>
          Abrir Workflow
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
