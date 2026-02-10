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
import type { ProspectionWorkflow, Segment } from "@/lib/api/prospectionService";

interface OnboardingListViewProps {
  workflows: ProspectionWorkflow[];
}

const SEGMENT_LABELS: Record<Segment, string> = {
  comercio: "Comércio",
  industria: "Indústria",
  servicos: "Serviços",
  agronegocio: "Agronegócio",
  varejo: "Varejo",
  insumos: "Insumos",
};

export function OnboardingListView({ workflows }: OnboardingListViewProps) {
  const formatCnpj = (cnpj: string) => {
    if (!cnpj) return "";
    if (cnpj.includes("/") || cnpj.includes(".")) return cnpj;
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  const getProgressPercentage = (workflow: ProspectionWorkflow) => {
    if (workflow.total_steps === 0) return 0;
    return Math.round((workflow.completed_steps / workflow.total_steps) * 100);
  };

  const getSLABadge = (workflow: ProspectionWorkflow) => {
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      lead: { label: "Lead", className: "bg-gray-100 text-gray-800" },
      contact: { label: "Contato", className: "bg-blue-100 text-blue-800" },
      documents: {
        label: "Documentação",
        className: "bg-yellow-100 text-yellow-800",
      },
      credit_analysis: {
        label: "Análise de Crédito",
        className: "bg-purple-100 text-purple-800",
      },
      approved: { label: "Aprovado", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejeitado", className: "bg-red-100 text-red-800" },
    };

    const badge = badges[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getSegmentBadge = (segment: Segment | null) => {
    if (!segment) return null;
    const label = SEGMENT_LABELS[segment] || segment;
    return <Badge className="bg-indigo-100 text-indigo-800">{label}</Badge>;
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
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
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
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {workflow.cedente_name || "Sem nome"}
                      </span>
                      {getSegmentBadge(workflow.cedente_segment)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {workflow.cedente_cnpj
                        ? formatCnpj(workflow.cedente_cnpj)
                        : "—"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[150px]">
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {workflow.completed_steps} de {workflow.total_steps}
                      </span>
                      <span>{getProgressPercentage(workflow)}%</span>
                    </div>
                    <Progress
                      value={getProgressPercentage(workflow)}
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {workflow.assigned_to ? (
                    <Badge variant="outline">{workflow.assigned_to}</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      Não atribuído
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {workflow.days_in_progress} dias
                  </span>
                </TableCell>
                <TableCell>{getSLABadge(workflow)}</TableCell>
                <TableCell>
                  {workflow.pending_items && workflow.pending_items.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">
                        {workflow.pending_items.length}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
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
