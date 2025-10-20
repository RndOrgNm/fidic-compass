import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, AlertTriangle, Newspaper, BarChart, ChevronDown, ChevronUp } from "lucide-react";
import { investorComplianceChecks } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface InvestorComplianceProps {
  investorId: string;
}

export function InvestorCompliance({ investorId }: InvestorComplianceProps) {
  const [expandedChecks, setExpandedChecks] = useState<string[]>([]);
  const checks = (investorComplianceChecks as any)[investorId] || [];

  const getCheckIcon = (type: string) => {
    switch (type) {
      case "pep":
        return <Shield className="h-6 w-6 text-blue-600" />;
      case "sanctions":
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case "adverse_media":
        return <Newspaper className="h-6 w-6 text-purple-600" />;
      case "credit_bureau":
        return <BarChart className="h-6 w-6 text-green-600" />;
      default:
        return <Shield className="h-6 w-6 text-gray-600" />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "clear":
        return <Badge className="bg-green-100 text-green-800">✓ Aprovado</Badge>;
      case "alert":
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Alerta</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">✗ Bloqueado</Badge>;
      default:
        return null;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixo</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
      default:
        return null;
    }
  };

  const toggleExpand = (checkId: string) => {
    setExpandedChecks((prev) =>
      prev.includes(checkId) ? prev.filter((id) => id !== checkId) : [...prev, checkId]
    );
  };

  const handleAction = (action: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Funcionalidade "${action}" em desenvolvimento`,
    });
  };

  const latestCheck = checks.length > 0 ? checks[checks.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold text-lg text-green-800">
                  ✓ Aprovado em Compliance
                </p>
                <p className="text-sm text-muted-foreground">
                  Todas as verificações foram concluídas com sucesso
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Última verificação</span>
              <p className="font-medium">
                {latestCheck
                  ? new Date(latestCheck.checkDate).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Próxima revisão</span>
              <p className="font-medium">
                {latestCheck
                  ? new Date(
                      new Date(latestCheck.checkDate).setMonth(
                        new Date(latestCheck.checkDate).getMonth() + 12
                      )
                    ).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Verificações realizadas</span>
              <p className="font-medium">{checks.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checks List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Verificações Realizadas</h2>
        {checks.map((check: any) => (
          <Card key={check.id} className="hover:shadow-md transition-shadow">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleExpand(check.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getCheckIcon(check.checkType)}
                  <div>
                    <h3 className="font-semibold">{check.checkName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getResultBadge(check.checkResult)}
                      {getRiskBadge(check.riskLevel)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(check.checkDate).toLocaleDateString("pt-BR")}
                  </span>
                  {expandedChecks.includes(check.id) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedChecks.includes(check.id) && (
              <>
                <Separator />
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nível de risco</span>
                      <div className="mt-1">{getRiskBadge(check.riskLevel)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fonte de dados</span>
                      <p className="font-medium">{check.dataSource}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executado por</span>
                      <p className="font-medium">{check.performedBy}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Resultados</span>
                    <p className="mt-1 text-sm p-3 bg-muted rounded-md">{check.findings}</p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("Ver resposta completa")}
                  >
                    Ver Resposta Completa (JSON)
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Verificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check: any, index: number) => (
              <div key={check.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary p-2">
                    {getCheckIcon(check.checkType)}
                  </div>
                  {index < checks.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{check.checkName}</p>
                    <span className="text-sm text-muted-foreground">
                      {new Date(check.checkDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getResultBadge(check.checkResult)}
                    {getRiskBadge(check.riskLevel)}
                  </div>
                  <p className="text-sm text-muted-foreground">{check.findings}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => handleAction("Nova Verificação")}>Nova Verificação</Button>
        <Button variant="outline" onClick={() => handleAction("Agendar Revisão")}>
          Agendar Revisão
        </Button>
        <Button variant="outline" onClick={() => handleAction("Exportar Relatório")}>
          Exportar Relatório de Compliance
        </Button>
      </div>
    </div>
  );
}
