import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Link2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  transactionDate: string;
  amount: number;
  originName: string;
  originCnpj: string;
  description: string;
  transactionType: "PIX" | "TED";
  reconciliationStatus: "unmatched" | "matched";
}

interface TransactionsTableProps {
  data: Transaction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TransactionsTable({ data, selectedId, onSelect }: TransactionsTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [minValue, setMinValue] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date>();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PIX":
        return <Badge className="bg-purple-500 hover:bg-purple-600">PIX</Badge>;
      case "TED":
        return <Badge className="bg-blue-500 hover:bg-blue-600">TED</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PIX">PIX</SelectItem>
            <SelectItem value="TED">TED</SelectItem>
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
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-32"></TableHead>
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
                <TableCell>{formatDate(item.transactionDate)}</TableCell>
                <TableCell>{getTypeBadge(item.transactionType)}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(item.amount)}</TableCell>
                <TableCell>{item.originName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.originCnpj}</TableCell>
                <TableCell className="text-sm">{truncateText(item.description)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}>
                    <Link2 className="h-4 w-4" />
                    Match Manual
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
