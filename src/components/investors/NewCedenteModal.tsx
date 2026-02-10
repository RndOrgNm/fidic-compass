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

interface NewCedenteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INITIAL_FORM = {
  company_name: "",
  cnpj: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  segment: "" as Segment | "",
  estimated_volume: "",
};

export function NewCedenteModal({ open, onOpenChange }: NewCedenteModalProps) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const createLead = useCreateNewLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.segment) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione um segmento",
        variant: "destructive",
      });
      return;
    }

    createLead.mutate(
      {
        company_name: formData.company_name,
        cnpj: formData.cnpj,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        segment: formData.segment as Segment,
        estimated_volume: formData.estimated_volume
          ? parseFloat(formData.estimated_volume)
          : 0,
      },
      {
        onSuccess: () => {
          toast({
            title: "Lead criado!",
            description: "Cedente e workflow de prospecção criados com sucesso.",
          });
          setFormData(INITIAL_FORM);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Cedente</DialogTitle>
          <DialogDescription>
            Preencha as informações do cedente para iniciar o processo de
            prospecção
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Razão Social</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              placeholder="Empresa ABC Ltda"
              required
            />
          </div>

          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) =>
                setFormData({ ...formData, cnpj: e.target.value })
              }
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          {/* Segment */}
          <div className="space-y-2">
            <Label htmlFor="segment">Segmento</Label>
            <Select
              value={formData.segment}
              onValueChange={(v) =>
                setFormData({ ...formData, segment: v as Segment })
              }
            >
              <SelectTrigger id="segment">
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

          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contact_name">Nome do Contato</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) =>
                setFormData({ ...formData, contact_name: e.target.value })
              }
              placeholder="João Silva"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData({ ...formData, contact_email: e.target.value })
                }
                placeholder="contato@empresa.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact_phone: e.target.value })
                }
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>

          {/* Estimated Volume */}
          <div className="space-y-2">
            <Label htmlFor="estimated_volume">Volume Estimado (R$)</Label>
            <Input
              id="estimated_volume"
              type="number"
              value={formData.estimated_volume}
              onChange={(e) =>
                setFormData({ ...formData, estimated_volume: e.target.value })
              }
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createLead.isPending}>
              {createLead.isPending ? "Criando..." : "Criar Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
