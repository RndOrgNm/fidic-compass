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

export const exceptionsData = [
  {
    id: "EXC-001",
    type: "unmatched_transaction",
    priority: "critical" as const,
    amount: 150000.00,
    description: "TED recebida sem correspondência no sistema",
    transactionDate: "2025-10-15",
    originName: "Empresa Desconhecida S.A.",
    originCnpj: "98.765.432/0001-99",
    assignedTo: "Maria Silva",
    status: "pending" as const,
    daysOpen: 2,
    createdAt: "2025-10-13T10:30:00"
  },
  {
    id: "EXC-002",
    type: "partial_payment",
    priority: "medium" as const,
    amount: 5000.00,
    description: "Pagamento parcial - Esperado R$ 50k, recebido R$ 5k",
    receivableNumber: "REC-2025-347",
    debtorName: "Comércio ABC Ltda",
    transactionDate: "2025-10-14",
    assignedTo: null,
    status: "pending" as const,
    daysOpen: 1,
    createdAt: "2025-10-14T14:20:00"
  },
  {
    id: "EXC-003",
    type: "amount_difference",
    priority: "low" as const,
    amount: 49950.00,
    description: "Diferença de valor - Esperado R$ 50k, recebido R$ 49.950",
    receivableNumber: "REC-2025-289",
    debtorName: "Indústria XYZ S.A.",
    transactionDate: "2025-10-15",
    amountDifference: -50.00,
    assignedTo: "Pedro Santos",
    status: "investigating" as const,
    daysOpen: 0,
    createdAt: "2025-10-15T09:15:00"
  },
  {
    id: "EXC-004",
    type: "unmatched_receivable",
    priority: "high" as const,
    amount: 85000.00,
    description: "Recebível vencido sem pagamento identificado",
    receivableNumber: "REC-2025-201",
    debtorName: "Distribuidora DEF Ltda",
    dueDate: "2025-10-10",
    daysOverdue: 5,
    assignedTo: "Ana Costa",
    status: "pending" as const,
    daysOpen: 5,
    createdAt: "2025-10-10T08:00:00"
  }
];

export const overdueAlertsData = [
  {
    id: "ALT-001",
    type: "payment_overdue",
    severity: "critical",
    receivableId: "REC-2025-156",
    receivableNumber: "REC-2025-156",
    debtorName: "Empresa XYZ Ltda",
    debtorCnpj: "12.345.678/0001-90",
    amount: 120000.00,
    dueDate: "2025-10-08",
    daysOverdue: 7,
    originatorName: "Fornecedor ABC S.A.",
    alertDate: "2025-10-15T08:00:00",
    notificationSent: true,
    acknowledged: false,
    status: "active",
    additionalInfo: "Histórico: 2 promessas não cumpridas nos últimos 30 dias"
  },
  {
    id: "ALT-002",
    type: "score_deterioration",
    severity: "high",
    originatorId: "ORG-045",
    originatorName: "Distribuidor DEF Ltda",
    previousScore: 720,
    currentScore: 570,
    scoreDrop: 150,
    totalExposure: 2500000.00,
    receivablesCount: 12,
    alertDate: "2025-10-15T10:30:00",
    notificationSent: true,
    acknowledged: false,
    status: "active",
    additionalInfo: "Novo protesto registrado: R$ 45k"
  },
  {
    id: "ALT-003",
    type: "concentration_risk",
    severity: "medium",
    debtorName: "Grande Varejista S.A.",
    debtorCnpj: "11.222.333/0001-00",
    concentration: 18.5,
    limit: 15.0,
    totalExposure: 4350000.00,
    receivablesCount: 28,
    alertDate: "2025-10-15T12:00:00",
    notificationSent: true,
    acknowledged: true,
    acknowledgedBy: "Maria Silva",
    acknowledgedAt: "2025-10-15T13:30:00",
    status: "active",
    additionalInfo: "Limite de concentração: 15% do patrimônio"
  },
  {
    id: "ALT-004",
    type: "payment_overdue",
    severity: "high",
    receivableId: "REC-2025-234",
    receivableNumber: "REC-2025-234",
    debtorName: "Comércio ABC Ltda",
    debtorCnpj: "98.765.432/0001-11",
    amount: 85000.00,
    dueDate: "2025-10-12",
    daysOverdue: 3,
    originatorName: "Indústria GHI S.A.",
    alertDate: "2025-10-15T14:20:00",
    notificationSent: true,
    acknowledged: false,
    status: "active",
    additionalInfo: "Primeiro atraso deste sacado"
  },
  {
    id: "ALT-005",
    type: "multiple_overdue",
    severity: "critical",
    debtorName: "Atacadista JKL Ltda",
    debtorCnpj: "55.666.777/0001-88",
    overdueCount: 5,
    totalOverdueAmount: 320000.00,
    oldestDaysOverdue: 15,
    alertDate: "2025-10-15T15:45:00",
    notificationSent: true,
    acknowledged: true,
    acknowledgedBy: "Pedro Santos",
    acknowledgedAt: "2025-10-15T16:00:00",
    status: "active",
    additionalInfo: "5 recebíveis em atraso totalizando R$ 320k"
  },
  {
    id: "ALT-006",
    type: "payment_overdue",
    severity: "medium",
    receivableId: "REC-2025-401",
    receivableNumber: "REC-2025-401",
    debtorName: "Varejista MNO Ltda",
    debtorCnpj: "22.333.444/0001-55",
    amount: 45000.00,
    dueDate: "2025-10-13",
    daysOverdue: 2,
    originatorName: "Fornecedor PQR S.A.",
    alertDate: "2025-10-15T16:30:00",
    notificationSent: false,
    acknowledged: false,
    status: "active",
    additionalInfo: "Contato telefônico realizado - sacado prometeu pagar amanhã"
  }
];
