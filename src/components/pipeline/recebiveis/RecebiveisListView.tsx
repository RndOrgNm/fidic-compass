import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
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
import { cn } from "@/lib/utils";
import { RECEBIVEIS_CHECKLIST } from "@/data/recebiveisChecklist";
import type { Recebivel } from "@/lib/api/recebiveisService";

interface RecebiveisListViewProps {
  recebiveis: Recebivel[];
}

export function RecebiveisListView({ recebiveis }: RecebiveisListViewProps) {
  const formatCnpj = (cnpj: string) => {
    if (!cnpj) return "";
    if (cnpj.includes("/") || cnpj.includes(".")) return cnpj;
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

  const getSLABadge = (r: Recebivel) => {
    if (!r.sla_deadline) return null;

    const now = new Date();
    const deadline = new Date(r.sla_deadline);
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

  const getSegmentBadge = (segment: string | null) => {
    if (!segment) return null;
    const segments: Record<string, { label: string; className: string }> = {
      comercio: { label: "Comércio", className: "bg-blue-100 text-blue-800" },
      industria: { label: "Indústria", className: "bg-purple-100 text-purple-800" },
      servicos: { label: "Serviços", className: "bg-cyan-100 text-cyan-800" },
      agronegocio: { label: "Agro", className: "bg-green-100 text-green-800" },
      varejo: { label: "Varejo", className: "bg-orange-100 text-orange-800" },
      insumos: { label: "Insumos", className: "bg-amber-100 text-amber-800" },
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
              <TableHead>Volume Estimado</TableHead>
              <TableHead>Atribuído a</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Pendências</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recebiveis.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {r.cedente_name || "Sem nome"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {r.cedente_cnpj ? formatCnpj(r.cedente_cnpj) : "—"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getSegmentBadge(r.cedente_segment)}</TableCell>
                <TableCell>{getStatusBadge(r.status)}</TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatCurrency(r.estimated_volume || r.receivable_value || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  {r.assigned_to ? (
                    <Badge variant="outline">{r.assigned_to}</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      Não atribuído
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{r.days_in_progress} dias</span>
                </TableCell>
                <TableCell>{getSLABadge(r)}</TableCell>
                <TableCell>
                  {(r.pending_items?.length ?? 0) > 0 ? (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <button type="button" className="cursor-help inline-flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">
                              {(RECEBIVEIS_CHECKLIST[r.status]?.length ?? 0) > 0
                                ? `${r.pending_items.length} de ${RECEBIVEIS_CHECKLIST[r.status]!.length}`
                                : `${r.pending_items.length} ${r.pending_items.length === 1 ? "pendência" : "pendências"}`}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[320px]">
                          <p className="font-medium mb-1.5">
                            Checklist — {r.pending_items.length} pendente{r.pending_items.length !== 1 ? "s" : ""} (bloqueia avanço)
                          </p>
                          <ul className="text-sm space-y-1.5">
                            {(RECEBIVEIS_CHECKLIST[r.status] ?? []).length > 0 ? (
                              (RECEBIVEIS_CHECKLIST[r.status] ?? []).map((item, idx) => {
                                const isPending = r.pending_items.includes(item);
                                return (
                                  <li key={idx} className={cn("flex items-start gap-1.5", isPending ? "text-foreground" : "text-muted-foreground")}>
                                    <span className={isPending ? "text-red-500 mt-0.5" : "text-green-600 mt-0.5"}>
                                      {isPending ? "○" : "✓"}
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                );
                              })
                            ) : (
                              r.pending_items.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))
                            )}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
