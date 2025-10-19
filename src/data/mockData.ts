export const dashboardData = {
  kpis: [
    { 
      label: "AuM Total", 
      value: "R$ 234.5M", 
      change: "+12.3%",
      trend: "up" as const,
      icon: "TrendingUp"
    },
    { 
      label: "Recebíveis Ativos", 
      value: "1.847", 
      change: "+156",
      trend: "up" as const,
      icon: "Receipt"
    },
    { 
      label: "Taxa de Inadimplência", 
      value: "2.3%", 
      change: "-0.5%",
      trend: "down" as const,
      icon: "AlertTriangle"
    },
    { 
      label: "Taxa de Conciliação", 
      value: "94.2%", 
      change: "+2.1%",
      trend: "up" as const,
      icon: "CheckCircle"
    }
  ],
  
  criticalAlerts: [
    {
      id: "1",
      type: "overdue",
      severity: "critical" as const,
      title: "12 recebíveis vencidos acima de R$ 50k",
      amount: "R$ 1.2M",
      time: "Há 2 horas",
      icon: "AlertCircle"
    },
    {
      id: "2",
      type: "score",
      severity: "high" as const,
      title: "3 cedentes com score em queda",
      description: "Distribuidora ABC: 720→570 pontos",
      time: "Há 5 horas",
      icon: "TrendingDown"
    },
    {
      id: "3",
      type: "reconciliation",
      severity: "medium" as const,
      title: "87 transações bancárias não conciliadas",
      amount: "R$ 2.3M",
      time: "Hoje, 08:00",
      icon: "ArrowLeftRight"
    }
  ],
  
  recentActivities: [
    {
      id: "1",
      type: "bordero",
      description: "Borderô #1234 processado - 156 recebíveis",
      user: "Sistema",
      time: "10 minutos atrás",
      icon: "FileText"
    },
    {
      id: "2",
      type: "reconciliation",
      description: "Conciliação diária completa - 94.2% match automático",
      user: "Sistema",
      time: "1 hora atrás",
      icon: "CheckCircle"
    },
    {
      id: "3",
      type: "redemption",
      description: "Investidor ABC S.A. resgatou R$ 500.000",
      user: "Maria Silva",
      time: "2 horas atrás",
      icon: "ArrowDownCircle"
    },
    {
      id: "4",
      type: "subscription",
      description: "Novo investidor aprovado: João Santos",
      user: "Ana Costa",
      time: "3 horas atrás",
      icon: "UserPlus"
    },
    {
      id: "5",
      type: "collection",
      description: "Promessa de pagamento registrada - R$ 150k",
      user: "Pedro Oliveira",
      time: "4 horas atrás",
      icon: "PhoneCall"
    }
  ]
};

export const receivablesData = [
  {
    id: "REC-2025-001",
    receivableNumber: "REC-2025-001",
    debtorName: "Empresa XYZ Ltda",
    debtorCnpj: "12.345.678/0001-90",
    invoiceNumber: "NF-9876",
    nominalValue: 50000.00,
    dueDate: "2025-10-15",
    status: "pending" as const
  },
  {
    id: "REC-2025-002",
    receivableNumber: "REC-2025-002",
    debtorName: "ABC Comércio S.A.",
    debtorCnpj: "98.765.432/0001-11",
    invoiceNumber: "NF-5432",
    nominalValue: 30000.00,
    dueDate: "2025-10-15",
    status: "pending" as const
  },
  {
    id: "REC-2025-003",
    receivableNumber: "REC-2025-003",
    debtorName: "Indústria DEF Ltda",
    debtorCnpj: "11.222.333/0001-44",
    invoiceNumber: "NF-7890",
    nominalValue: 75000.00,
    dueDate: "2025-10-16",
    status: "pending" as const
  }
];

export const bankTransactionsData = [
  {
    id: "TRX-001",
    transactionDate: "2025-10-15",
    amount: 50000.00,
    originName: "EMPRESA XYZ LTDA",
    originCnpj: "12.345.678/0001-90",
    description: "TED REC PAG NF 9876",
    transactionType: "PIX" as const,
    reconciliationStatus: "unmatched" as const
  },
  {
    id: "TRX-002",
    transactionDate: "2025-10-14",
    amount: 30000.00,
    originName: "JOSE SILVA",
    originCnpj: "123.456.789-00",
    description: "PIX PAGAMENTO",
    transactionType: "PIX" as const,
    reconciliationStatus: "unmatched" as const
  },
  {
    id: "TRX-003",
    transactionDate: "2025-10-15",
    amount: 75000.00,
    originName: "INDUSTRIA DEF LTDA",
    originCnpj: "11.222.333/0001-44",
    description: "TED NF 7890",
    transactionType: "TED" as const,
    reconciliationStatus: "unmatched" as const
  }
];
