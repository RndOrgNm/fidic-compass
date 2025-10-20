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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NewInvestorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewInvestorModal({ open, onOpenChange }: NewInvestorModalProps) {
  const [investorType, setInvestorType] = useState<"individual" | "institutional">("individual");
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    email: "",
    phone: "",
    riskProfile: "moderate",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Investidor criado!",
      description: "Redirecionando para onboarding...",
    });
    
    // Reset form
    setFormData({
      name: "",
      taxId: "",
      email: "",
      phone: "",
      riskProfile: "moderate",
    });
    setInvestorType("individual");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Investidor</DialogTitle>
          <DialogDescription>
            Preencha as informações básicas para iniciar o onboarding
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investor Type */}
          <div className="space-y-3">
            <Label>Tipo de Investidor</Label>
            <RadioGroup
              value={investorType}
              onValueChange={(v) => setInvestorType(v as "individual" | "institutional")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="cursor-pointer">
                  Pessoa Física
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="institutional" id="institutional" />
                <Label htmlFor="institutional" className="cursor-pointer">
                  Pessoa Jurídica
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {investorType === "individual" ? "Nome Completo" : "Razão Social"}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={
                investorType === "individual"
                  ? "João Silva Santos"
                  : "ABC Investimentos S.A."
              }
              required
            />
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <Label htmlFor="taxId">
              {investorType === "individual" ? "CPF" : "CNPJ"}
            </Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder={
                investorType === "individual"
                  ? "000.000.000-00"
                  : "00.000.000/0000-00"
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 98765-4321"
                required
              />
            </div>
          </div>

          {/* Risk Profile */}
          <div className="space-y-2">
            <Label htmlFor="riskProfile">Perfil de Risco</Label>
            <Select
              value={formData.riskProfile}
              onValueChange={(v) => setFormData({ ...formData, riskProfile: v })}
            >
              <SelectTrigger id="riskProfile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservador</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="aggressive">Agressivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Iniciar Onboarding</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
