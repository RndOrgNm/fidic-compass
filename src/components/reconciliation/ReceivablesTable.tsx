import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Receivable {
  id: string;
  receivableNumber: string;
  debtorName: string;
  debtorCnpj: string;
  invoiceNumber: string;
  nominalValue: number;
  dueDate: string;
  status: "pending" | "matched";
}

interface ReceivablesTableProps {
  data: Receivable[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ReceivablesTable({ data, selectedId, onSelect }: ReceivablesTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minValue, setMinValue] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date>();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>;
      case "matched":
        return <Badge className="bg-green-500 hover:bg-green-600">Conciliado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="matched">Conciliado</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Valor mínimo"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          className="w-[150px]"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP", { locale: ptBR }) : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Recebível #</TableHead>
              <TableHead>Sacado</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>NF</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedId === item.id && "bg-primary/5 border-l-4 border-l-primary"
                )}
                onClick={() => onSelect(item.id)}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedId === item.id}
                    onCheckedChange={() => onSelect(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.receivableNumber}</TableCell>
                <TableCell>{item.debtorName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatCnpj(item.debtorCnpj)}</TableCell>
                <TableCell>{item.invoiceNumber}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(item.nominalValue)}</TableCell>
                <TableCell>{formatDate(item.dueDate)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
