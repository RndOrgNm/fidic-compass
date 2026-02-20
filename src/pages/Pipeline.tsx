import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CedentesTab } from "@/components/pipeline/cedentes/CedentesTab";
import { ProspectionTab } from "@/components/pipeline/prospecao/ProspectionTab";
import { ClientMatchingTab } from "@/components/pipeline/alocacao/ClientMatchingTab";
import { MonitoramentoTab } from "@/components/pipeline/monitoramento/MonitoramentoTab";

export default function Pipeline() {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pipeline de Investimentos</h1>
        <p className="text-muted-foreground">Cedentes, prospecção, alocação e monitoramento de recebíveis em fundos</p>
      </div>

      <Tabs defaultValue="cedentes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="cedentes">Cedentes</TabsTrigger>
          <TabsTrigger value="prospection">Prospecção</TabsTrigger>
          <TabsTrigger value="matching">Alocação</TabsTrigger>
          <TabsTrigger value="monitoramento">Monitoramento</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="cedentes">
            <CedentesTab />
          </TabsContent>

          <TabsContent value="prospection">
            <ProspectionTab />
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
