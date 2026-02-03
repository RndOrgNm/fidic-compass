import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, RefreshCw, Mail, TrendingUp, DollarSign, ArrowUpCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { investorDetailData } from "@/data";
import { InvestorBasicInfo } from "@/components/investor-details/InvestorBasicInfo";
import { InvestorDocuments } from "@/components/investor-details/InvestorDocuments";
import { InvestorInvestments } from "@/components/investor-details/InvestorInvestments";
import { InvestorCompliance } from "@/components/investor-details/InvestorCompliance";
import { InvestorHistory } from "@/components/investor-details/InvestorHistory";
import { toast } from "@/hooks/use-toast";

export default function InvestorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const investor = id ? (investorDetailData as any)[id] : null;

  if (!investor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-semibold">Investidor não encontrado</h2>
        <Button onClick={() => navigate("/investors")}>
          Voltar para Investidores
        </Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getKycBadge = () => {
    switch (investor.kycStatus) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">✓ Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">✗ Expirado</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    if (investor.investorType === "individual") {
      return <Badge className="bg-blue-100 text-blue-800">PF</Badge>;
    }
    return <Badge className="bg-purple-100 text-purple-800">PJ</Badge>;
  };

  const handleAction = (action: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Funcionalidade "${action}" em desenvolvimento`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investors")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{investor.legalName}</h1>
            {getTypeBadge()}
            {getKycBadge()}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction("Editar Cadastro")}>
            <Edit className="h-4 w-4" />
            Editar Cadastro
          </Button>
          <Button variant="outline" onClick={() => handleAction("Renovar KYC")}>
            <RefreshCw className="h-4 w-4" />
            Renovar KYC
          </Button>
          <Button variant="outline" onClick={() => handleAction("Enviar Comunicação")}>
            <Mail className="h-4 w-4" />
            Enviar Comunicação
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Mais Ações</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction("Solicitar resgate")}>
                Solicitar resgate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Gerar relatório")}>
                Gerar relatório
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Bloquear investidor")}>
                Bloquear investidor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("Histórico completo")}>
                Histórico completo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Patrimônio Atual</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {formatCurrency(investor.currentBalance)}
              </div>
              <div className="text-xs text-muted-foreground">
                Em {investor.fundsCount} {investor.fundsCount === 1 ? "fundo" : "fundos"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Investido</span>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {formatCurrency(investor.totalInvested)}
              </div>
              <div className="text-xs text-muted-foreground">
                Desde {new Date(investor.createdAt).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rentabilidade</span>
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                +{investor.returnPercentage.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(investor.totalReturn)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Status KYC</span>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">Aprovado</div>
              <div className="text-xs text-muted-foreground">
                Válido até {new Date(investor.kycExpiryDate).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Dados Cadastrais</TabsTrigger>
          <TabsTrigger value="documents">Documentos KYC</TabsTrigger>
          <TabsTrigger value="investments">Investimentos</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic">
            <InvestorBasicInfo investor={investor} />
          </TabsContent>

          <TabsContent value="documents">
            <InvestorDocuments investorId={investor.id} />
          </TabsContent>

          <TabsContent value="investments">
            <InvestorInvestments investor={investor} />
          </TabsContent>

          <TabsContent value="compliance">
            <InvestorCompliance investorId={investor.id} />
          </TabsContent>

          <TabsContent value="history">
            <InvestorHistory investorId={investor.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
