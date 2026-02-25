import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PIPELINE_INVALIDATE_KEYS } from "@/lib/queryKeys";
import { CedentesTab } from "@/components/pipeline/cedentes/CedentesTab";
import { RecebiveisTab } from "@/components/pipeline/recebiveis/RecebiveisTab";
import { ClientMatchingTab } from "@/components/pipeline/alocacao/ClientMatchingTab";
import { MonitoramentoTab } from "@/components/pipeline/monitoramento/MonitoramentoTab";

export default function Pipeline() {
  const queryClient = useQueryClient();

  // Refetch pipeline data on mount — ensures fresh data when agent changes pipeline via web chat OR WhatsApp/SQS
  useEffect(() => {
    PIPELINE_INVALIDATE_KEYS.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pipeline de Investimentos</h1>
        <p className="text-muted-foreground">Cedentes, recebíveis, alocação e monitoramento em fundos</p>
      </div>

      <Tabs defaultValue="cedentes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="cedentes">Cedentes</TabsTrigger>
          <TabsTrigger value="recebiveis">Recebíveis</TabsTrigger>
          <TabsTrigger value="matching">Alocação</TabsTrigger>
          <TabsTrigger value="monitoramento">Monitoramento</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="cedentes">
            <CedentesTab />
          </TabsContent>

          <TabsContent value="recebiveis">
            <RecebiveisTab />
          </TabsContent>

          <TabsContent value="matching">
            <ClientMatchingTab />
          </TabsContent>

          <TabsContent value="monitoramento">
            <MonitoramentoTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}
