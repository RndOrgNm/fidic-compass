import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, UserPlus, MessageSquare, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Exception } from "./ExceptionsTab";

interface ExceptionCardProps {
  exception: Exception;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onViewDetails: (exception: Exception) => void;
  onAssignToMe: () => void;
  onAddNote: (id: string) => void;
  onResolve: (id: string, action: string) => void;
}

export function ExceptionCard({
  exception,
  isSelected,
  onToggleSelection,
  onViewDetails,
  onAssignToMe,
  onAddNote,
  onResolve,
}: ExceptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "critical":
        return { 
          emoji: "🔴", 
          label: "CRÍTICO", 
          className: "bg-red-50 border-l-4 border-red-500",
          badgeClass: "bg-red-500 hover:bg-red-600"
        };
      case "high":
        return { 
          emoji: "🟠", 
          label: "ALTO", 
          className: "bg-orange-50 border-l-4 border-orange-500",
          badgeClass: "bg-orange-500 hover:bg-orange-600"
        };
      case "medium":
        return { 
          emoji: "🟡", 
          label: "MÉDIO", 
          className: "bg-yellow-50 border-l-4 border-yellow-500",
          badgeClass: "bg-yellow-500 hover:bg-yellow-600"
        };
      case "low":
        return { 
          emoji: "🟢", 
          label: "BAIXO", 
          className: "bg-green-50 border-l-4 border-green-500",
          badgeClass: "bg-green-500 hover:bg-green-600"
        };
      default:
        return { 
          emoji: "⚪", 
          label: "NORMAL", 
          className: "",
          badgeClass: "bg-gray-500 hover:bg-gray-600"
        };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      unmatched_transaction: "Transação não identificada",
      partial_payment: "Pagamento parcial",
      amount_difference: "Diferença de valor",
      unmatched_receivable: "Recebível não pago"
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>;
      case "investigating":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Investigando</Badge>;
      case "resolved":
        return <Badge className="bg-green-500 hover:bg-green-600">Resolvido</Badge>;
      case "closed":
        return <Badge variant="outline">Fechado</Badge>;
      default:
        return null;
    }
  };

  const priorityConfig = getPriorityConfig(exception.priority);

  return (
    <Card className={cn("transition-all hover:shadow-md", priorityConfig.className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(exception.id)}
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={cn("text-sm font-bold", priorityConfig.badgeClass)}>
                  {priorityConfig.emoji} {priorityConfig.label}
                </Badge>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(exception.amount)}
                </span>
                <Badge variant="outline">{getTypeLabel(exception.type)}</Badge>
              </div>

              <p className="text-sm font-medium">{exception.description}</p>

              {isExpanded && (
                <div className="space-y-3 pt-3 border-t animate-fade-in">
                  {/* Contextual Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {exception.transactionDate && (
                      <div>
                        <span className="text-muted-foreground">Data da transação:</span>
                        <span className="ml-2 font-medium">{formatDate(exception.transactionDate)}</span>
                      </div>
                    )}
                    {exception.receivableNumber && (
                      <div>
                        <span className="text-muted-foreground">Recebível #:</span>
                        <span className="ml-2 font-medium">{exception.receivableNumber}</span>
                      </div>
                    )}
                    {exception.debtorName && (
                      <div>
                        <span className="text-muted-foreground">Sacado:</span>
                        <span className="ml-2 font-medium">{exception.debtorName}</span>
                      </div>
                    )}
                    {exception.originName && (
                      <div>
                        <span className="text-muted-foreground">Origem:</span>
                        <span className="ml-2 font-medium">{exception.originName}</span>
                      </div>
                    )}
                    {exception.originCnpj && (
                      <div>
                        <span className="text-muted-foreground">CNPJ:</span>
                        <span className="ml-2 font-medium">{exception.originCnpj}</span>
                      </div>
                    )}
                    {exception.dueDate && (
                      <div>
                        <span className="text-muted-foreground">Vencimento:</span>
                        <span className="ml-2 font-medium">{formatDate(exception.dueDate)}</span>
                      </div>
                    )}
                    {exception.daysOverdue && (
                      <div>
                        <span className="text-muted-foreground">Dias vencido:</span>
                        <span className="ml-2 font-bold text-red-600">{exception.daysOverdue} dias</span>
                      </div>
                    )}
                    {exception.amountDifference && (
                      <div>
                        <span className="text-muted-foreground">Diferença:</span>
                        <span className="ml-2 font-bold text-orange-600">{formatCurrency(exception.amountDifference)}</span>
                      </div>
                    )}
                  </div>

                  {/* Management Info */}
                  <div className="flex items-center gap-4 pt-3 border-t text-sm">
                    <div>
                      <span className="text-muted-foreground">Atribuído a:</span>
                      <span className="ml-2 font-medium">
                        {exception.assignedTo || (
                          <span className="text-orange-600">Não atribuído</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2">{getStatusBadge(exception.status)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo em aberto:</span>
                      <span className="ml-2 font-bold text-primary">{exception.daysOpen} dia(s)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Footer Actions */}
        {isExpanded && (
          <div className="flex items-center gap-2 pt-4 border-t animate-fade-in">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(exception)}
            >
              <FileText className="h-4 w-4" />
              Ver Detalhes
            </Button>

            {!exception.assignedTo && (
              <Button
                size="sm"
                variant="outline"
                onClick={onAssignToMe}
              >
                <UserPlus className="h-4 w-4" />
                Atribuir para Mim
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddNote(exception.id)}
            >
              <MessageSquare className="h-4 w-4" />
              Adicionar Nota
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="default">
                  <Check className="h-4 w-4" />
                  Resolver
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onResolve(exception.id, "Aceitar pagamento parcial")}>
                  Aceitar pagamento parcial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResolve(exception.id, "Solicitar complemento")}>
                  Solicitar complemento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResolve(exception.id, "Marcar como resolvido")}>
                  Marcar como resolvido
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onResolve(exception.id, "Escalar para supervisão")}>
                  Escalar para supervisão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
