import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
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

export function CedentesListView({ cedentes }: CedentesListViewProps) {
  const handleOpenDetails = () => {
    toast({
      title: "Em desenvolvimento",
      description: "Detalhes do cedente serão implementados em breve",
    });
  };

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
                    <Button size="sm" variant="outline" onClick={handleOpenDetails}>
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
