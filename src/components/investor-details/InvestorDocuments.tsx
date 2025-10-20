import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  CreditCard,
  Home,
  DollarSign,
  Download,
  Eye,
  Plus,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { investorDocuments } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";

interface InvestorDocumentsProps {
  investorId: string;
}

export function InvestorDocuments({ investorId }: InvestorDocumentsProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const documents = (investorDocuments as any)[investorId] || [];

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) {
      return `${(bytes / 1048576).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getDocumentIcon = (type: string) => {
    if (["contrato_social", "cnpj", "rg", "cpf"].includes(type)) {
      return <CreditCard className="h-8 w-8 text-primary" />;
    } else if (type === "proof_address") {
      return <Home className="h-8 w-8 text-primary" />;
    } else if (["financial_statement", "income_proof"].includes(type)) {
      return <DollarSign className="h-8 w-8 text-primary" />;
    }
    return <FileText className="h-8 w-8 text-primary" />;
  };

  const getDocumentTypeName = (type: string) => {
    const types: Record<string, string> = {
      contrato_social: "Contrato Social",
      cnpj: "CNPJ",
      rg: "RG",
      cpf: "CPF",
      proof_address: "Comprovante de Endereço",
      financial_statement: "Demonstrativo Financeiro",
      income_proof: "Comprovante de Renda",
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">✓ Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">✗ Rejeitado</Badge>;
      default:
        return null;
    }
  };

  const getExpiryBadge = (expiryDate: string | null) => {
    if (!expiryDate) return null;

    const days = differenceInDays(new Date(expiryDate), new Date());

    if (days < 0) {
      return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
    } else if (days < 30) {
      return <Badge className="bg-orange-100 text-orange-800">{days} dias</Badge>;
    } else if (days < 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">{days} dias</Badge>;
    }
    return null;
  };

  const filteredDocuments = documents.filter((doc: any) => {
    if (statusFilter === "all") return true;
    return doc.validationStatus === statusFilter;
  });

  const groupedDocuments = {
    approved: filteredDocuments.filter((d: any) => d.validationStatus === "approved"),
    pending: filteredDocuments.filter((d: any) => d.validationStatus === "pending"),
    rejected: filteredDocuments.filter((d: any) => d.validationStatus === "rejected"),
    expiring: filteredDocuments.filter(
      (d: any) =>
        d.expiryDate &&
        differenceInDays(new Date(d.expiryDate), new Date()) < 60 &&
        differenceInDays(new Date(d.expiryDate), new Date()) >= 0
    ),
  };

  const handleAction = (action: string, doc: any) => {
    toast({
      title: "Em desenvolvimento",
      description: `Ação "${action}" em desenvolvimento`,
    });
  };

  const renderDocumentCard = (doc: any) => (
    <Card key={doc.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getDocumentIcon(doc.documentType)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold">{doc.documentName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{getDocumentTypeName(doc.documentType)}</Badge>
                  {getStatusBadge(doc.validationStatus)}
                  {getExpiryBadge(doc.expiryDate)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
              <div>
                <span>Arquivo: {doc.fileName}</span>
              </div>
              <div>
                <span>Tamanho: {formatFileSize(doc.fileSize)}</span>
              </div>
              <div>
                <span>Upload: {new Date(doc.uploadDate).toLocaleDateString("pt-BR")}</span>
              </div>
              {doc.expiryDate && (
                <div>
                  <span>Expira: {new Date(doc.expiryDate).toLocaleDateString("pt-BR")}</span>
                </div>
              )}
            </div>

            {doc.validatedBy && (
              <div className="text-xs text-muted-foreground mb-3">
                Validado por {doc.validatedBy} em{" "}
                {new Date(doc.validatedAt).toLocaleDateString("pt-BR")}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Download", doc)}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction("Visualizar", doc)}>
                <Eye className="h-4 w-4" />
                Visualizar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {doc.validationStatus === "pending" && (
                    <>
                      <DropdownMenuItem onClick={() => handleAction("Aprovar", doc)}>
                        Aprovar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Rejeitar", doc)}>
                        Rejeitar
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleAction("Solicitar reenvio", doc)}>
                    Solicitar reenvio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Excluir", doc)}>
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documentos KYC</CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4" />
                Solicitar Novo Documento
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Approved Documents */}
      {groupedDocuments.approved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-green-700">✓ Aprovados</h2>
          <div className="space-y-3">
            {groupedDocuments.approved.map((doc: any) => renderDocumentCard(doc))}
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {groupedDocuments.expiring.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-orange-700">⚠️ Próximos ao Vencimento</h2>
          <div className="space-y-3">
            {groupedDocuments.expiring.map((doc: any) => renderDocumentCard(doc))}
          </div>
        </div>
      )}

      {/* Pending Documents */}
      {groupedDocuments.pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-yellow-700">⏳ Pendentes de Validação</h2>
          <div className="space-y-3">
            {groupedDocuments.pending.map((doc: any) => renderDocumentCard(doc))}
          </div>
        </div>
      )}

      {/* Rejected Documents */}
      {groupedDocuments.rejected.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-red-700">✗ Rejeitados</h2>
          <div className="space-y-3">
            {groupedDocuments.rejected.map((doc: any) => renderDocumentCard(doc))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum documento encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
