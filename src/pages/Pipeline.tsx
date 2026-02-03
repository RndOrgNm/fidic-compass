import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProspectionTab } from "@/components/pipeline/ProspectionTab";
import { ClientMatchingTab } from "@/components/pipeline/ClientMatchingTab";

export default function Pipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pipeline de Investimentos</h1>
        <p className="text-muted-foreground">Prospecção e alocação de recebíveis em fundos</p>
      </div>

      <Tabs defaultValue="prospection" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="prospection">Prospecção</TabsTrigger>
          <TabsTrigger value="matching">Alocação em Fundos</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="prospection">
            <ProspectionTab />
          </TabsContent>

          <TabsContent value="matching">
            <ClientMatchingTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
