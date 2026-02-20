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
import type { MonitoramentoPipelineItem } from "./MonitoramentoCard";
import type { MonitoramentoPipelineStatus } from "@/data/pipelineData";

const STATUS_BADGES: Record<MonitoramentoPipelineStatus, { label: string; className: string }> = {
  alertas_deteccao: { label: "Alertas Detecção", className: "bg-amber-100 text-amber-800" },
  correcoes_acoes: { label: "Correções/Ações", className: "bg-orange-100 text-orange-800" },
  relatorios_em_andamento: { label: "Relatórios em Andamento", className: "bg-blue-100 text-blue-800" },
  em_conformidade_auditoria: { label: "Em conformidade/Auditoria", className: "bg-purple-100 text-purple-800" },
  encerrado: { label: "Encerrado", className: "bg-green-100 text-green-800" },
};

interface MonitoramentoListViewProps {
  items: MonitoramentoPipelineItem[];
  onOpenDetails: (item: MonitoramentoPipelineItem) => void;
}

export function MonitoramentoListView({ items, onOpenDetails }: MonitoramentoListViewProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fundo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dias</TableHead>
              <TableHead>Atribuído a</TableHead>
              <TableHead>Pendências</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const statusBadge = STATUS_BADGES[item.status] ?? {
                label: item.status,
                className: "bg-gray-100 text-gray-800",
              };
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-medium">{item.title}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.fundName ?? "—"}
                  </TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>{item.days_in_status} dias</TableCell>
                  <TableCell>
                    {item.assigned_to ?? (
                      <span className="text-muted-foreground">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.pending_items?.length ? (
                      <span className="text-red-600 font-medium">
                        {item.pending_items.length} {item.pending_items.length === 1 ? "item" : "itens"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenDetails(item)}
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
