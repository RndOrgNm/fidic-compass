import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AlertDetailsModalProps {
  alert: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcknowledge: () => void;
}

export function AlertDetailsModal({
  alert,
  open,
  onOpenChange,
  onAcknowledge,
}: AlertDetailsModalProps) {
  const [note, setNote] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatCnpj = (cnpj: string) => {
    if (cnpj.length === 18) return cnpj;
    if (cnpj.length === 14) {
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return cnpj;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600">Crítico</Badge>;
      case "high":
        return <Badge className="bg-orange-600">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-600">Médio</Badge>;
      default:
        return <Badge className="bg-blue-600">Baixo</Badge>;
    }
  };

  const handleSaveNote = () => {
    if (!note.trim()) return;
    toast({
      title: "Nota salva",
      description: "Sua nota foi salva com sucesso",
    });
    setNote("");
  };

  const handleAcknowledgeAndClose = () => {
    onAcknowledge();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Alerta {alert.id}</DialogTitle>
          <DialogDescription>
            Informações completas sobre o alerta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informações Gerais</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID do Alerta:</span>
                <p className="font-medium">{alert.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Severidade:</span>
                <div className="mt-1">{getSeverityBadge(alert.severity)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Data do Alerta:</span>
                <p className="font-medium">{formatDateTime(alert.alertDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={alert.status === "active" ? "default" : "secondary"} className="mt-1">
                  {alert.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Notificação Enviada:</span>
                <p className="font-medium">{alert.notificationSent ? "Sim" : "Não"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Reconhecido:</span>
                <p className="font-medium">
                  {alert.acknowledged ? (
                    <>
                      Sim - por {alert.acknowledgedBy}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        em {formatDateTime(alert.acknowledgedAt)}
                      </span>
                    </>
                  ) : (
                    "Não"
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Specific Information by Type */}
          <div className="space-y-4">
            <h3 className="font-semibold">Detalhes Específicos</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {alert.type === "payment_overdue" && (
                <>
                  <div>
                    <span className="text-muted-foreground">Recebível:</span>
                    <p className="font-medium">{alert.receivableNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <p className="font-medium">{formatCurrency(alert.amount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sacado:</span>
                    <p className="font-medium">{alert.debtorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{formatCnpj(alert.debtorCnpj)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cedente:</span>
                    <p className="font-medium">{alert.originatorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <p className="font-medium">{formatDate(alert.dueDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dias em Atraso:</span>
                    <Badge variant="destructive" className="mt-1">
                      {alert.daysOverdue} dias
                    </Badge>
                  </div>
                </>
              )}

              {alert.type === "score_deterioration" && (
                <>
                  <div>
                    <span className="text-muted-foreground">Cedente:</span>
                    <p className="font-medium">{alert.originatorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Score Anterior:</span>
                    <p className="font-medium">{alert.previousScore}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Score Atual:</span>
                    <p className="font-medium">{alert.currentScore}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Queda:</span>
                    <Badge variant="destructive" className="mt-1">
                      -{alert.scoreDrop} pontos
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exposição Total:</span>
                    <p className="font-medium">{formatCurrency(alert.totalExposure)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Recebíveis Afetados:</span>
                    <p className="font-medium">{alert.receivablesCount}</p>
                  </div>
                </>
              )}

              {alert.type === "concentration_risk" && (
                <>
                  <div>
                    <span className="text-muted-foreground">Sacado:</span>
                    <p className="font-medium">{alert.debtorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{formatCnpj(alert.debtorCnpj)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Concentração Atual:</span>
                    <Badge className="mt-1 bg-orange-600">{alert.concentration}%</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Limite:</span>
                    <p className="font-medium">{alert.limit}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Exposição Total:</span>
                    <p className="font-medium">{formatCurrency(alert.totalExposure)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantidade de Recebíveis:</span>
                    <p className="font-medium">{alert.receivablesCount}</p>
                  </div>
                </>
              )}

              {alert.type === "multiple_overdue" && (
                <>
                  <div>
                    <span className="text-muted-foreground">Sacado:</span>
                    <p className="font-medium">{alert.debtorName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{formatCnpj(alert.debtorCnpj)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Recebíveis em Atraso:</span>
                    <Badge variant="destructive" className="mt-1">
                      {alert.overdueCount}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor Total:</span>
                    <p className="font-medium">{formatCurrency(alert.totalOverdueAmount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mais Antigo:</span>
                    <Badge variant="destructive" className="mt-1">
                      {alert.oldestDaysOverdue} dias
                    </Badge>
                  </div>
                </>
              )}
            </div>

            {alert.additionalInfo && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-sm font-medium mb-1">Informações Adicionais:</p>
                <p className="text-sm text-muted-foreground">{alert.additionalInfo}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* History Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Histórico de Ações</h3>
            <div className="p-4 bg-muted/50 rounded-md text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma ação registrada
              </p>
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Adicionar Nota</h3>
            <Textarea
              placeholder="Digite sua nota sobre este alerta..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
            <Button onClick={handleSaveNote} disabled={!note.trim()}>
              Salvar Nota
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {!alert.acknowledged && (
            <Button onClick={handleAcknowledgeAndClose}>
              Reconhecer e Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
