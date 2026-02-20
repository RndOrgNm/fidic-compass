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
import type { AllocationWorkflow } from "@/lib/api/allocationService";

interface MatchingListViewProps {
  workflows: AllocationWorkflow[];
}

export function MatchingListView({ workflows }: MatchingListViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProgressPercentage = (workflow: AllocationWorkflow) => {
    if (!workflow.total_steps) return 0;
    return Math.round((workflow.completed_steps / workflow.total_steps) * 100);
  };

  const getSLABadge = (workflow: AllocationWorkflow) => {
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
      pending_match: { label: "Aguardando Match", className: "bg-slate-100 text-slate-800" },
      fund_selection: { label: "Seleção de Fundo", className: "bg-blue-100 text-blue-800" },
      compliance_check: { label: "Verificação Compliance", className: "bg-yellow-100 text-yellow-800" },
      allocated: { label: "Alocado", className: "bg-green-100 text-green-800" },
    };

    const badge = badges[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800">{score}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">{score}</Badge>;
    } else if (score > 0) {
      return <Badge className="bg-red-100 text-red-800">{score}</Badge>;
    }
    return <span className="text-sm text-muted-foreground">-</span>;
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
              <TableHead>Recebível</TableHead>
              <TableHead>Cedente</TableHead>
              <TableHead>Sacado</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fundo</TableHead>
              <TableHead>Progresso</TableHead>
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
                  <span className="font-medium">{workflow.receivable_number ?? "—"}</span>
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px]">
                    <div className="font-medium truncate">{workflow.cedente_name ?? "—"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px]">
                    <div className="truncate">{workflow.debtor_name ?? "—"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatCurrency(workflow.nominal_value)}
                  </span>
                </TableCell>
                <TableCell>{getRiskBadge(workflow.risk_score)}</TableCell>
                <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                <TableCell>
                  {workflow.fund_name ? (
                    <Badge variant="outline">{workflow.fund_name}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[100px]">
                    <div className="flex items-center justify-between text-xs">
                      <span>
                        {workflow.completed_steps}/{workflow.total_steps}
                      </span>
                      <span>{getProgressPercentage(workflow)}%</span>
                    </div>
                    <Progress value={getProgressPercentage(workflow)} className="h-2" />
                  </div>
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
