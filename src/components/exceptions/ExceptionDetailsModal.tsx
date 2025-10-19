import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, Paperclip } from "lucide-react";
import type { Exception } from "./ExceptionsTab";

interface ExceptionDetailsModalProps {
  exception: Exception;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExceptionDetailsModal({ exception, open, onOpenChange }: ExceptionDetailsModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      unmatched_transaction: "Transação não identificada",
      partial_payment: "Pagamento parcial",
      amount_difference: "Diferença de valor",
      unmatched_receivable: "Recebível não pago"
    };
    return types[type] || type;
  };

  const mockHistory = [
    {
      id: "1",
      action: "Exceção criada automaticamente",
      user: "Sistema",
      timestamp: exception.createdAt,
      details: "Identificada durante conciliação automática"
    },
    {
      id: "2",
      action: "Atribuída para análise",
      user: "Sistema",
      timestamp: exception.createdAt,
      details: exception.assignedTo ? `Atribuída para ${exception.assignedTo}` : "Aguardando atribuição"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Exceção #{exception.id}
            <Badge variant="outline">{getTypeLabel(exception.type)}</Badge>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos e histórico da exceção
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">
              <FileText className="h-4 w-4 mr-2" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Paperclip className="h-4 w-4 mr-2" />
              Documentos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">{exception.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridade</Label>
                  <p className="font-medium uppercase">{exception.priority}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="text-lg font-bold text-primary">{formatCurrency(exception.amount)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium capitalize">{exception.status}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="font-medium">{exception.description}</p>
              </div>

              {exception.transactionDate && (
                <div>
                  <Label className="text-muted-foreground">Data da Transação</Label>
                  <p className="font-medium">{formatDate(exception.transactionDate)}</p>
                </div>
              )}

              {exception.receivableNumber && (
                <div>
                  <Label className="text-muted-foreground">Recebível</Label>
                  <p className="font-medium">{exception.receivableNumber}</p>
                </div>
              )}

              {exception.debtorName && (
                <div>
                  <Label className="text-muted-foreground">Sacado</Label>
                  <p className="font-medium">{exception.debtorName}</p>
                </div>
              )}

              {exception.originName && (
                <div>
                  <Label className="text-muted-foreground">Origem</Label>
                  <p className="font-medium">{exception.originName}</p>
                </div>
              )}

              {exception.originCnpj && (
                <div>
                  <Label className="text-muted-foreground">CNPJ/CPF</Label>
                  <p className="font-medium">{exception.originCnpj}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Atribuído a</Label>
                  <p className="font-medium">{exception.assignedTo || "Não atribuído"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tempo em aberto</Label>
                  <p className="font-bold text-primary">{exception.daysOpen} dia(s)</p>
                </div>
              </div>

              <div className="pt-4">
                <Label htmlFor="note">Adicionar Nota</Label>
                <Textarea
                  id="note"
                  placeholder="Digite sua nota sobre esta exceção..."
                  className="mt-2"
                  rows={4}
                />
                <Button className="mt-2">Salvar Nota</Button>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-4">
                {mockHistory.map((item, index) => (
                  <div key={item.id} className="relative pb-4">
                    {index !== mockHistory.length - 1 && (
                      <div className="absolute left-4 top-8 h-full w-0.5 bg-border" />
                    )}
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{item.user}</span>
                          <span>•</span>
                          <span>{formatDateTime(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="text-center py-12 text-muted-foreground">
                <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum documento anexado</p>
                <Button variant="outline" className="mt-4">
                  Adicionar Documento
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
