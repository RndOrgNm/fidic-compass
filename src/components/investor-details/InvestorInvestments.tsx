import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { investorFundPositions } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface InvestorInvestmentsProps {
  investor: any;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export function InvestorInvestments({ investor }: InvestorInvestmentsProps) {
  const positions = (investorFundPositions as any)[investor.id] || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 4) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const chartData = positions.map((pos: any, index: number) => ({
    name: pos.fundCode,
    value: pos.totalValue,
    percentage: ((pos.totalValue / investor.currentBalance) * 100).toFixed(1),
  }));

  const handleAction = (action: string) => {
    toast({
      title: "Em desenvolvimento",
      description: `Funcionalidade "${action}" em desenvolvimento`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Consolidado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Total Investido</span>
              <p className="text-2xl font-bold">{formatCurrency(investor.totalInvested)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Patrimônio Atual</span>
              <p className="text-2xl font-bold">{formatCurrency(investor.currentBalance)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Rentabilidade Total</span>
              <p className="text-2xl font-bold text-green-600">
                +{investor.returnPercentage.toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(investor.totalReturn)}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Quantidade de Fundos</span>
              <p className="text-2xl font-bold">{investor.fundsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Fundo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento da Alocação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positions.map((pos: any, index: number) => (
                <div key={pos.fundId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium">{pos.fundCode}</p>
                      <p className="text-sm text-muted-foreground">{pos.fundName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(pos.totalValue)}</p>
                    <p className="text-sm text-muted-foreground">
                      {((pos.totalValue / investor.currentBalance) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Posições Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fundo</TableHead>
                <TableHead>Quantidade de Cotas</TableHead>
                <TableHead>Valor Investido</TableHead>
                <TableHead>Valor Atual</TableHead>
                <TableHead>Rentabilidade</TableHead>
                <TableHead>Data de Aplicação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos: any) => {
                const investedValue = pos.quotaQuantity * pos.quotaValue;
                return (
                  <TableRow key={pos.fundId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pos.fundCode}</div>
                        <div className="text-sm text-muted-foreground">{pos.fundName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatNumber(pos.quotaQuantity)} cotas</div>
                        <div className="text-sm text-muted-foreground">
                          Valor da cota: {formatCurrency(pos.quotaValue)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(investedValue)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(pos.totalValue)}</TableCell>
                    <TableCell>
                      <div className="text-green-600">
                        <div className="font-medium">+{pos.returnPercentage.toFixed(2)}%</div>
                        <div className="text-sm">{formatCurrency(pos.returnAmount)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(pos.investmentDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {pos.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      ) : pos.status === "pending" ? (
                        <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Resgatado</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("Ver detalhes")}
                        >
                          Detalhes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("Solicitar resgate")}
                        >
                          Resgatar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => handleAction("Nova Aplicação")}>Nova Aplicação</Button>
        <Button variant="outline" onClick={() => handleAction("Solicitar Resgate")}>
          Solicitar Resgate
        </Button>
        <Button variant="outline" onClick={() => handleAction("Exportar Extrato")}>
          Exportar Extrato
        </Button>
      </div>
    </div>
  );
}
