import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Receivable {
  id: string;
  receivableNumber: string;
  debtorName: string;
  debtorCnpj: string;
  invoiceNumber: string;
  nominalValue: number;
  dueDate: string;
  status: string;
}

interface Transaction {
  id: string;
  transactionDate: string;
  amount: number;
  originName: string;
  originCnpj: string;
  description: string;
  transactionType: string;
  reconciliationStatus: string;
}

interface ReconciliationFooterProps {
  receivable: Receivable;
  transaction: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReconciliationFooter({ receivable, transaction, onConfirm, onCancel }: ReconciliationFooterProps) {
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

  // Calculate match confidence based on name and amount similarity
  const calculateConfidence = () => {
    const amountMatch = receivable.nominalValue === transaction.amount;
    const namesSimilar = transaction.originName.toLowerCase().includes(receivable.debtorName.toLowerCase().split(' ')[0]);
    
    if (amountMatch && namesSimilar) return 95;
    if (amountMatch) return 85;
    if (namesSimilar) return 70;
    return 60;
  };

  const confidence = calculateConfidence();

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-t-primary shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="container max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between gap-8">
          {/* Left - Receivable Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Recebível Selecionado</h3>
            <div className="space-y-1">
              <p className="font-bold">{receivable.receivableNumber}</p>
              <p className="text-sm">{receivable.debtorName}</p>
              <p className="text-sm text-muted-foreground">{receivable.invoiceNumber} • Venc: {formatDate(receivable.dueDate)}</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(receivable.nominalValue)}</p>
            </div>
          </div>

          {/* Center - Match Indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl">↔️</div>
            <Badge variant="outline" className="text-base px-4 py-1.5">
              Match: {confidence}% confiança
            </Badge>
          </div>

          {/* Right - Transaction Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Transação Selecionada</h3>
            <div className="space-y-1">
              <p className="font-bold">{transaction.transactionType}</p>
              <p className="text-sm">{transaction.originName}</p>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.transactionDate)}</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(transaction.amount)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-8">
            <Button 
              size="lg" 
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={onConfirm}
            >
              <CheckCircle className="h-5 w-5" />
              Confirmar Conciliação
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
