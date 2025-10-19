import { useState } from "react";
import { Upload, Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { receivablesData, bankTransactionsData } from "@/data/mockData";
import { ReceivablesTable } from "./ReceivablesTable";
import { TransactionsTable } from "./TransactionsTable";
import { ReconciliationFooter } from "./ReconciliationFooter";

export function ReconciliationTab() {
  const [receivables, setReceivables] = useState(receivablesData);
  const [transactions, setTransactions] = useState(bankTransactionsData);
  const [selectedReceivable, setSelectedReceivable] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessAutomatic = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    toast({
      title: "Processamento concluído",
      description: "23 conciliações automáticas realizadas",
    });
  };

  const handleConfirmReconciliation = () => {
    if (!selectedReceivable || !selectedTransaction) return;

    // Remove items from lists
    setReceivables(prev => prev.filter(r => r.id !== selectedReceivable));
    setTransactions(prev => prev.filter(t => t.id !== selectedTransaction));
    
    // Clear selections
    setSelectedReceivable(null);
    setSelectedTransaction(null);

    toast({
      title: "Conciliação confirmada",
      description: "Match realizado com sucesso",
    });
  };

  const handleCancelReconciliation = () => {
    setSelectedReceivable(null);
    setSelectedTransaction(null);
  };

  const reconciliationProgress = 94;
  const matchedCount = 1234;
  const pendingCount = 87;
  const unmatchedCount = 12;

  const selectedReceivableData = receivables.find(r => r.id === selectedReceivable);
  const selectedTransactionData = transactions.find(t => t.id === selectedTransaction);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4" />
              Importar CNAB
            </Button>
            <Button 
              onClick={handleProcessAutomatic}
              disabled={isProcessing}
            >
              <Zap className={`h-4 w-4 ${isProcessing ? 'animate-pulse' : ''}`} />
              {isProcessing ? "Processando..." : "Processar Automático"}
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso de Conciliação</span>
              <span className="text-sm font-bold">{reconciliationProgress}% conciliado</span>
            </div>
            <Progress value={reconciliationProgress} className="h-2" />
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                {matchedCount.toLocaleString('pt-BR')} matches automáticos
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                {pendingCount} pendentes
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
                {unmatchedCount} não identificados
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Receivables */}
        <Card>
          <CardHeader>
            <CardTitle>Recebíveis Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceivablesTable
              data={receivables}
              selectedId={selectedReceivable}
              onSelect={setSelectedReceivable}
            />
          </CardContent>
        </Card>

        {/* Right Side - Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Bancárias</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              data={transactions}
              selectedId={selectedTransaction}
              onSelect={setSelectedTransaction}
            />
          </CardContent>
        </Card>
      </div>

      {/* Footer - Appears when both items selected */}
      {selectedReceivable && selectedTransaction && selectedReceivableData && selectedTransactionData && (
        <ReconciliationFooter
          receivable={selectedReceivableData}
          transaction={selectedTransactionData}
          onConfirm={handleConfirmReconciliation}
          onCancel={handleCancelReconciliation}
        />
      )}
    </div>
  );
}
