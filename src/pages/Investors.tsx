import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestorsListTab } from "@/components/investors/InvestorsListTab";
import { OnboardingPipelineTab } from "@/components/investors/OnboardingPipelineTab";

export default function Investors() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestão de Investidores</h1>
        <p className="text-muted-foreground">Investidores e pipeline de onboarding</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="investors" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="investors">Investidores</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline de Onboarding</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="investors">
            <InvestorsListTab />
          </TabsContent>

          <TabsContent value="pipeline">
            <OnboardingPipelineTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
