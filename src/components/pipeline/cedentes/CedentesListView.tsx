import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CedentePipelineItem } from "./CedenteCard";
import type { CedentePipelineStatus } from "@/data/pipelineData";

const SEGMENT_LABELS: Record<string, string> = {
  comercio: "Comércio",
  industria: "Indústria",
  servicos: "Serviços",
  agronegocio: "Agronegócio",
  varejo: "Varejo",
  insumos: "Insumos",
};

const STATUS_BADGES: Record<CedentePipelineStatus, { label: string; className: string }> = {
  lead: { label: "Lead", className: "bg-slate-100 text-slate-800" },
  due_diligence: { label: "Due Diligence", className: "bg-blue-100 text-blue-800" },
  documentacao_pendente: { label: "Doc. Pendente", className: "bg-yellow-100 text-yellow-800" },
  cedente_ativo: { label: "Cedente Ativo", className: "bg-green-100 text-green-800" },
  bloqueado_desistencia: { label: "Bloqueado/Desistência", className: "bg-red-100 text-red-800" },
};

interface CedentesListViewProps {
  cedentes: CedentePipelineItem[];
  checklist: Record<string, string[]>;
  onOpenDetails: (cedente: CedentePipelineItem) => void;
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

export function CedentesListView({ cedentes, checklist, onOpenDetails }: CedentesListViewProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Atribuído a</TableHead>
              <TableHead>Pendências</TableHead>
              <TableHead>Recebíveis / Limite</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cedentes.map((cedente) => {
              const statusBadge = STATUS_BADGES[cedente.status] ?? {
                label: cedente.status,
                className: "bg-gray-100 text-gray-800",
              };
              return (
                <TableRow key={cedente.id}>
                  <TableCell>
                    <span className="font-medium">{cedente.companyName}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatCnpj(cedente.cnpj)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cedente.contactName}</div>
                      {cedente.contactEmail && (
                        <div className="text-xs text-muted-foreground">{cedente.contactEmail}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {SEGMENT_LABELS[cedente.segment] ?? cedente.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cedente.creditScore > 0 ? cedente.creditScore : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {cedente.days_in_status} dias
                  </TableCell>
                  <TableCell className="text-sm">
                    {cedente.assigned_to ?? (
                      <span className="text-muted-foreground">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cedente.pending_items?.length ? (
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <button type="button" className="cursor-help inline-flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                {cedente.pending_items.length} {cedente.pending_items.length === 1 ? "item" : "itens"}
                              </span>
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
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cedente.totalReceivables > 0 || cedente.approvedLimit > 0 ? (
                      <>
                        {cedente.totalReceivables > 0 && formatCurrency(cedente.totalReceivables)}
                        {cedente.totalReceivables > 0 && cedente.approvedLimit > 0 && " / "}
                        {cedente.approvedLimit > 0 && formatCurrency(cedente.approvedLimit)}
                      </>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenDetails(cedente)}
                    >
                      Abrir
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
