import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useCreateCedente } from "@/hooks/useCedentes";
import type { Segment } from "@/lib/api/cedenteService";

interface NewCedenteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCedenteModal({ open, onOpenChange }: NewCedenteModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [segment, setSegment] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [approvedLimit, setApprovedLimit] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const createCedente = useCreateCedente();

  const formatCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/^(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
      return numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCnpj(formatCnpj(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactPhone(formatPhone(e.target.value));
  };

  const resetForm = () => {
    setCompanyName("");
    setCnpj("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setSegment("");
    setCreditScore("");
    setApprovedLimit("");
    setAssignedTo("");
  };

  const handleSubmit = () => {
    if (!companyName || !cnpj || !contactName || !contactEmail || !contactPhone || !segment) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha: Nome da Empresa, CNPJ, Nome do Contato, E-mail, Telefone e Segmento.",
        variant: "destructive",
      });
      return;
    }

    const creditScoreNum = creditScore ? parseInt(creditScore, 10) : 0;
    if (creditScore && (isNaN(creditScoreNum) || creditScoreNum < 0 || creditScoreNum > 1000)) {
      toast({
        title: "Score inválido",
        description: "O score de crédito deve estar entre 0 e 1000.",
        variant: "destructive",
      });
      return;
    }

    const approvedLimitNum = approvedLimit ? parseFloat(approvedLimit) : 0;
    if (approvedLimit && (isNaN(approvedLimitNum) || approvedLimitNum < 0)) {
      toast({
        title: "Limite inválido",
        description: "O limite aprovado deve ser um número positivo.",
        variant: "destructive",
      });
      return;
    }

    createCedente.mutate(
      {
        company_name: companyName,
        cnpj,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        segment: segment as Segment,
        credit_score: creditScoreNum,
        approved_limit: approvedLimitNum,
        assigned_to: assignedTo || null,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Cedente criado",
            description: `${data.companyName} foi adicionado ao pipeline de cedentes.`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: "Erro ao criar cedente",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cedente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cedente. Os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">
              Nome da Empresa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Distribuidora ABC Ltda"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cnpj">
              CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="segment">
              Segmento <span className="text-red-500">*</span>
            </Label>
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercio">Comércio</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="agronegocio">Agronegócio</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="insumos">Insumos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactName">
              Nome do Contato <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="creditScore">Score de Crédito (0–1000)</Label>
              <Input
                id="creditScore"
                type="number"
                min={0}
                max={1000}
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="Ex: 750"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="approvedLimit">Limite Aprovado (R$)</Label>
              <Input
                id="approvedLimit"
                type="number"
                min={0}
                step={0.01}
                value={approvedLimit}
                onChange={(e) => setApprovedLimit(e.target.value)}
                placeholder="Ex: 1000000"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Atribuído a</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Ex: Maria Silva"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createCedente.isPending}>
            {createCedente.isPending ? "Criando..." : "Criar Cedente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
