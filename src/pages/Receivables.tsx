import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconciliationTab } from "@/components/reconciliation/ReconciliationTab";
import { ExceptionsTab } from "@/components/exceptions/ExceptionsTab";

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
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <CardTitle>Alertas de Inadimplência</CardTitle>
                    <CardDescription>Recebíveis vencidos e em risco</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  Conteúdo em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
