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
import { useCreateNewLead } from "@/hooks/useProspection";
import type { Segment } from "@/lib/api/prospectionService";

interface NewRecebiveisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRecebiveisModal({ open, onOpenChange }: NewRecebiveisModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [segment, setSegment] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("");

  const createLead = useCreateNewLead();

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
    setEstimatedVolume("");
  };

  const handleSubmit = () => {
    if (!companyName || !cnpj || !contactName || !segment) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    createLead.mutate(
      {
        company_name: companyName,
        cnpj,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        segment: segment as Segment,
        estimated_volume: estimatedVolume ? parseFloat(estimatedVolume) : 0,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Lead criado com sucesso",
            description: `${data.company_name} foi adicionado ao pipeline de recebíveis`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: "Erro ao criar lead",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
          <DialogDescription>
            Adicione uma nova empresa ao pipeline de recebíveis
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
              <Label htmlFor="contactEmail">E-mail</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimatedVolume">Volume Mensal Estimado (R$)</Label>
            <Input
              id="estimatedVolume"
              type="number"
              value={estimatedVolume}
              onChange={(e) => setEstimatedVolume(e.target.value)}
              placeholder="Ex: 500000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={createLead.isPending}>
            {createLead.isPending ? "Criando..." : "Criar Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
