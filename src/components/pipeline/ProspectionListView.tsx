import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, AlertTriangle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProspectionListViewProps {
  workflows: any[];
}

export function ProspectionListView({ workflows }: ProspectionListViewProps) {
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

  const getProgressPercentage = (workflow: any) => {
    return Math.round((workflow.completedSteps / workflow.totalSteps) * 100);
  };

  const getSLABadge = (workflow: any) => {
    if (!workflow.slaDeadline) return null;

    const now = new Date();
    const deadline = new Date(workflow.slaDeadline);
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      lead: { label: "Lead", className: "bg-slate-100 text-slate-800" },
      contact: { label: "Em Contato", className: "bg-blue-100 text-blue-800" },
      documents: { label: "Documentação", className: "bg-yellow-100 text-yellow-800" },
      credit_analysis: { label: "Análise de Crédito", className: "bg-purple-100 text-purple-800" },
      approved: { label: "Aprovado", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeitado", className: "bg-red-100 text-red-800" },
    };

    const badge = badges[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge className={badge.className}>{badge.label}</Badge>;
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

  const handleOpenWorkflow = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Detalhes do workflow serão implementados em breve",
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Cedente</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Volume Estimado</TableHead>
              <TableHead>Atribuído a</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Pendências</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{workflow.cedenteName}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCnpj(workflow.cedenteCnpj)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getSegmentBadge(workflow.cedenteSegment)}</TableCell>
                <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[120px]">
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {workflow.completedSteps} de {workflow.totalSteps}
                      </span>
                      <span>{getProgressPercentage(workflow)}%</span>
                    </div>
                    <Progress value={getProgressPercentage(workflow)} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatCurrency(workflow.estimatedVolume || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  {workflow.assignedTo ? (
                    <Badge variant="outline">{workflow.assignedTo}</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      Não atribuído
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{workflow.daysInProgress} dias</span>
                </TableCell>
                <TableCell>{getSLABadge(workflow)}</TableCell>
                <TableCell>
                  {workflow.pendingItems && workflow.pendingItems.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">
                        {workflow.pendingItems.length}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={handleOpenWorkflow}>
                    Abrir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
