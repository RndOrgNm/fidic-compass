import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InvestorBasicInfoProps {
  investor: any;
}

export function InvestorBasicInfo({ investor }: InvestorBasicInfoProps) {
  const formatTaxId = (taxId: string) => {
    if (taxId.includes("-")) {
      return taxId.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
    return taxId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const getAge = (birthDate: string) => {
    const age = Math.floor(
      (new Date().getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    return age;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "conservative":
        return <Badge className="bg-blue-100 text-blue-800">Conservador</Badge>;
      case "moderate":
        return <Badge className="bg-yellow-100 text-yellow-800">Moderado</Badge>;
      case "aggressive":
        return <Badge className="bg-orange-100 text-orange-800">Agressivo</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      default:
        return null;
    }
  };

  const getDaysToExpiry = () => {
    if (!investor.kycExpiryDate) return null;
    const days = differenceInDays(new Date(investor.kycExpiryDate), new Date());
    
    if (days < 0) {
      return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
    } else if (days < 30) {
      return <Badge className="bg-orange-100 text-orange-800">{days} dias</Badge>;
    } else if (days < 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">{days} dias</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{days} dias</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Dados Principais</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  {investor.investorType === "individual" ? "Nome Completo" : "Razão Social"}
                </span>
                <p className="font-medium">{investor.legalName}</p>
              </div>
              {investor.tradeName && (
                <div>
                  <span className="text-sm text-muted-foreground">Nome Fantasia</span>
                  <p className="font-medium">{investor.tradeName}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">
                  {investor.investorType === "individual" ? "CPF" : "CNPJ"}
                </span>
                <p className="font-medium">{formatTaxId(investor.taxId)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo</span>
                <div className="mt-1">
                  {investor.investorType === "individual" ? (
                    <Badge className="bg-blue-100 text-blue-800">Pessoa Física</Badge>
                  ) : (
                    <Badge className="bg-purple-100 text-purple-800">Pessoa Jurídica</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{investor.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(investor.email, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Telefone</span>
                  <p className="font-medium">{investor.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(investor.phone, "Telefone")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Endereço</span>
                <p className="font-medium">{investor.addressStreet}</p>
                <p className="text-sm text-muted-foreground">
                  {investor.addressCity} - {investor.addressState}
                </p>
                <p className="text-sm text-muted-foreground">CEP: {investor.addressZip}</p>
              </div>
            </div>
          </div>

          {/* Corporate or Personal Info */}
          {investor.investorType === "institutional" ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Informações Corporativas
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Data de Fundação</span>
                  <p className="font-medium">
                    {new Date(investor.foundingDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Capital Social</span>
                  <p className="font-medium">{formatCurrency(investor.shareCapital)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Atividade Principal</span>
                  <p className="font-medium">{investor.mainActivity}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Representante Legal</span>
                  <p className="font-medium">{investor.legalRepresentative}</p>
                  <p className="text-sm text-muted-foreground">
                    CPF: {formatTaxId(investor.legalRepCpf)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Informações Pessoais
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Data de Nascimento</span>
                  <p className="font-medium">
                    {new Date(investor.birthDate).toLocaleDateString("pt-BR")} (
                    {getAge(investor.birthDate)} anos)
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Nacionalidade</span>
                  <p className="font-medium">{investor.nationality}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Estado Civil</span>
                  <p className="font-medium">{investor.maritalStatus}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Profissão</span>
                  <p className="font-medium">{investor.occupation}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Renda Mensal</span>
                  <p className="font-medium">{formatCurrency(investor.monthlyIncome)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Editar Informações
          </Button>
        </CardFooter>
      </Card>

      {/* Right Column - Investment Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Investimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Classification */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Classificação</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Perfil de Risco</span>
                <div className="mt-1">{getRiskBadge(investor.riskProfile)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="mt-1">{getStatusBadge(investor.status)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Cliente desde</span>
                <p className="font-medium">
                  {new Date(investor.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Última atividade</span>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(investor.lastActivity), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* KYC and Compliance */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">KYC e Compliance</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Status KYC</span>
                <div className="mt-1">
                  {investor.kycStatus === "approved" ? (
                    <Badge className="bg-green-100 text-green-800">✓ Aprovado</Badge>
                  ) : investor.kycStatus === "pending" ? (
                    <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">✗ Expirado</Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Data de aprovação</span>
                <p className="font-medium">
                  {new Date(investor.kycCompletedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Aprovado por</span>
                <p className="font-medium">{investor.kycApprovedBy}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Validade</span>
                <p className="font-medium">
                  {new Date(investor.kycExpiryDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Dias para expirar</span>
                <div className="mt-1">{getDaysToExpiry()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
