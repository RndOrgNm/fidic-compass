import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Download, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { investorsData } from "@/data/mockData";
import { NewInvestorModal } from "./NewInvestorModal";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function InvestorsListTab() {
  const navigate = useNavigate();
  const [investors, setInvestors] = useState(investorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showNewInvestorModal, setShowNewInvestorModal] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTaxId = (taxId: string) => {
    if (taxId.includes("-")) {
      // CPF
      return taxId.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    } else {
      // CNPJ
      return taxId.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/^\((\d{2})\)\s?(\d{4,5})-(\d{4})$/, "($1) $2-$3");
  };

  const getRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const filteredInvestors = useMemo(() => {
    let filtered = investors;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.legalName.toLowerCase().includes(query) ||
          inv.taxId.includes(query) ||
          inv.email.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((inv) => inv.investorType === typeFilter);
    }

    // KYC filter
    if (kycFilter !== "all") {
      filtered = filtered.filter((inv) => inv.kycStatus === kycFilter);
    }

    // Risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((inv) => inv.riskProfile === riskFilter);
    }

    return filtered;
  }, [investors, searchQuery, typeFilter, kycFilter, riskFilter]);

  const paginatedInvestors = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredInvestors.slice(start, end);
  }, [filteredInvestors, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedInvestors.map((inv) => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectInvestor = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Funcionalidade "${action}" em desenvolvimento`,
    });
  };

  const getKycBadge = (status: string) => {
    switch (status) {
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

  const getTypeBadge = (type: string) => {
    if (type === "individual") {
      return <Badge className="bg-blue-100 text-blue-800">PF</Badge>;
    }
    return <Badge className="bg-purple-100 text-purple-800">PJ</Badge>;
  };

  const allSelected =
    paginatedInvestors.length > 0 && selectedIds.length === paginatedInvestors.length;

  return (
    <div className="space-y-6">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <Card className="bg-primary/5 border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {selectedIds.length} investidores selecionados
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("Enviar comunicação")}
                >
                  <Mail className="h-4 w-4" />
                  Enviar Comunicação
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("Exportar dados")}
                >
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("Renovar KYC")}
                >
                  Renovar KYC
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Investidores ({filteredInvestors.length})
            </CardTitle>
            <Button onClick={() => setShowNewInvestorModal(true)}>
              <Plus className="h-4 w-4" />
              Novo Investidor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF/CNPJ, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="individual">Pessoa Física</SelectItem>
                <SelectItem value="institutional">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Perfil de Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="conservative">Conservador</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="aggressive">Agressivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Investidor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status KYC</TableHead>
                <TableHead>Perfil de Risco</TableHead>
                <TableHead>Investimentos</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvestors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(investor.id)}
                      onCheckedChange={(checked) =>
                        handleSelectInvestor(investor.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{investor.legalName}</span>
                        {getTypeBadge(investor.investorType)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTaxId(investor.taxId)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{investor.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatPhone(investor.phone)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getKycBadge(investor.kycStatus)}
                      {investor.kycExpiryDate && (
                        <div className="text-xs text-muted-foreground">
                          Válido até {new Date(investor.kycExpiryDate).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(investor.riskProfile)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(investor.totalInvested)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {investor.fundsCount} {investor.fundsCount === 1 ? "fundo" : "fundos"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getRelativeTime(investor.lastActivity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate(`/investors/${investor.id}`)}>
                Ver Detalhes
              </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">⋮</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleBulkAction("Editar cadastro")}
                          >
                            Editar cadastro
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkAction("Renovar KYC")}
                          >
                            Renovar KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkAction("Enviar comunicação")}
                          >
                            Enviar comunicação
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkAction("Histórico completo")}
                          >
                            Histórico completo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * itemsPerPage + 1}-
                {Math.min(page * itemsPerPage, filteredInvestors.length)} de{" "}
                {filteredInvestors.length} investidores
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewInvestorModal
        open={showNewInvestorModal}
        onOpenChange={setShowNewInvestorModal}
      />
    </div>
  );
}
