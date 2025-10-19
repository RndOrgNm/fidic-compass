import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconciliationTab } from "@/components/reconciliation/ReconciliationTab";
import { ExceptionsTab } from "@/components/exceptions/ExceptionsTab";
import { AlertsTab } from "@/components/alerts/AlertsTab";

export default function Receivables() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Recebimentos</h1>
        <p className="text-muted-foreground">Conciliação, exceções e alertas de inadimplência</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reconciliation" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="reconciliation">Conciliação Bancária</TabsTrigger>
          <TabsTrigger value="exceptions">Fila de Exceções</TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Inadimplência</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="reconciliation">
            <ReconciliationTab />
          </TabsContent>

          <TabsContent value="exceptions">
            <ExceptionsTab />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
