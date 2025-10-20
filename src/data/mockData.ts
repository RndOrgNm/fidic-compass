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

export const investorsData = [
  {
    id: "INV-001",
    investorType: "institutional",
    taxId: "12.345.678/0001-90",
    legalName: "ABC Investimentos S.A.",
    tradeName: "ABC Investimentos",
    email: "contato@abcinvest.com.br",
    phone: "(11) 3456-7890",
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2024-08-15T10:30:00",
    kycExpiryDate: "2025-12-31",
    totalInvested: 5420000.00,
    fundsCount: 3,
    lastActivity: "2025-10-10T14:20:00",
    createdAt: "2024-06-01T09:00:00"
  },
  {
    id: "INV-002",
    investorType: "individual",
    taxId: "123.456.789-00",
    legalName: "João Silva Santos",
    tradeName: null,
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2025-09-20T16:45:00",
    kycExpiryDate: "2026-09-20",
    totalInvested: 184330.00,
    fundsCount: 2,
    lastActivity: "2025-10-14T11:30:00",
    createdAt: "2025-09-10T10:15:00"
  },
  {
    id: "INV-003",
    investorType: "institutional",
    taxId: "98.765.432/0001-11",
    legalName: "XYZ Participações Ltda",
    tradeName: "XYZ Capital",
    email: "contato@xyzcapital.com.br",
    phone: "(21) 2345-6789",
    riskProfile: "aggressive",
    kycStatus: "expired",
    kycCompletedAt: "2023-10-01T09:00:00",
    kycExpiryDate: "2025-10-01",
    totalInvested: 12500000.00,
    fundsCount: 5,
    lastActivity: "2025-10-15T09:00:00",
    createdAt: "2023-05-15T08:30:00"
  },
  {
    id: "INV-004",
    investorType: "individual",
    taxId: "987.654.321-00",
    legalName: "Maria Oliveira Costa",
    tradeName: null,
    email: "maria.costa@email.com",
    phone: "(11) 91234-5678",
    riskProfile: "conservative",
    kycStatus: "pending",
    kycCompletedAt: null,
    kycExpiryDate: null,
    totalInvested: 0,
    fundsCount: 0,
    lastActivity: "2025-10-15T10:30:00",
    createdAt: "2025-10-15T10:30:00"
  }
];

export const onboardingWorkflowsData = [
  {
    id: "WF-001",
    investorId: "INV-004",
    investorName: "Maria Oliveira Costa",
    investorTaxId: "987.654.321-00",
    investorType: "individual",
    workflowStatus: "documents_pending",
    currentStep: "upload_documents",
    totalSteps: 5,
    completedSteps: 2,
    startedAt: "2025-10-15T10:30:00",
    lastActivityAt: "2025-10-15T11:45:00",
    completedAt: null,
    assignedTo: "Ana Costa",
    pendingItems: [
      "Comprovante de residência (vencido)",
      "Declaração de IR 2024"
    ],
    slaDeadline: "2025-10-18T23:59:59",
    daysInProgress: 0
  },
  {
    id: "WF-002",
    investorId: "INV-005",
    investorName: "Carlos Eduardo Ferreira",
    investorTaxId: "111.222.333-44",
    investorType: "individual",
    workflowStatus: "compliance_review",
    currentStep: "compliance_analysis",
    totalSteps: 5,
    completedSteps: 3,
    startedAt: "2025-10-12T09:15:00",
    lastActivityAt: "2025-10-14T16:30:00",
    completedAt: null,
    assignedTo: "Ana Costa",
    pendingItems: [
      "Análise de compliance pendente"
    ],
    slaDeadline: "2025-10-17T23:59:59",
    daysInProgress: 3
  },
  {
    id: "WF-003",
    investorId: "INV-006",
    investorName: "Tech Ventures LTDA",
    investorTaxId: "22.333.444/0001-55",
    investorType: "institutional",
    workflowStatus: "started",
    currentStep: "basic_information",
    totalSteps: 6,
    completedSteps: 1,
    startedAt: "2025-10-14T14:00:00",
    lastActivityAt: "2025-10-14T14:30:00",
    completedAt: null,
    assignedTo: null,
    pendingItems: [
      "Dados cadastrais incompletos",
      "Documentos não enviados"
    ],
    slaDeadline: "2025-10-19T23:59:59",
    daysInProgress: 1
  },
  {
    id: "WF-004",
    investorId: "INV-007",
    investorName: "Roberto Almeida",
    investorTaxId: "555.666.777-88",
    investorType: "individual",
    workflowStatus: "approved",
    currentStep: "completed",
    totalSteps: 5,
    completedSteps: 5,
    startedAt: "2025-10-01T10:00:00",
    lastActivityAt: "2025-10-08T15:45:00",
    completedAt: "2025-10-08T15:45:00",
    assignedTo: "Pedro Santos",
    pendingItems: [],
    slaDeadline: null,
    daysInProgress: 7
  },
  {
    id: "WF-005",
    investorId: "INV-008",
    investorName: "Holding Investments S.A.",
    investorTaxId: "33.444.555/0001-66",
    investorType: "institutional",
    workflowStatus: "rejected",
    currentStep: "compliance_analysis",
    totalSteps: 6,
    completedSteps: 3,
    startedAt: "2025-09-28T11:00:00",
    lastActivityAt: "2025-10-05T10:30:00",
    completedAt: "2025-10-05T10:30:00",
    assignedTo: "Ana Costa",
    pendingItems: [],
    rejectionReason: "Pendências regulatórias não resolvidas - empresa com restrições na CVM",
    slaDeadline: null,
    daysInProgress: 7
  }
];

export const investorDetailData = {
  "INV-001": {
    // Dados básicos
    id: "INV-001",
    investorType: "institutional",
    taxId: "12.345.678/0001-90",
    legalName: "ABC Investimentos S.A.",
    tradeName: "ABC Investimentos",
    email: "contato@abcinvest.com.br",
    phone: "(11) 3456-7890",
    addressStreet: "Av. Paulista, 1000 - Sala 1501",
    addressCity: "São Paulo",
    addressState: "SP",
    addressZip: "01310-100",
    
    // Informações corporativas (para PJ)
    foundingDate: "2018-03-15",
    shareCapital: 10000000.00,
    mainActivity: "Gestão de investimentos e participações",
    legalRepresentative: "Carlos Alberto Silva",
    legalRepCpf: "123.456.789-00",
    
    // KYC e Compliance
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2024-08-15T10:30:00",
    kycExpiryDate: "2025-12-31",
    kycApprovedBy: "Ana Costa",
    
    // Investimentos
    totalInvested: 5420000.00,
    currentBalance: 5789430.00,
    totalReturn: 369430.00,
    returnPercentage: 6.82,
    fundsCount: 3,
    
    // Metadata
    createdAt: "2024-06-01T09:00:00",
    lastActivity: "2025-10-10T14:20:00",
    status: "active"
  },
  "INV-002": {
    // Dados básicos
    id: "INV-002",
    investorType: "individual",
    taxId: "123.456.789-00",
    legalName: "João Silva Santos",
    tradeName: null,
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    addressStreet: "Rua das Flores, 456 - Apto 302",
    addressCity: "São Paulo",
    addressState: "SP",
    addressZip: "04567-890",
    
    // Informações pessoais (para PF)
    birthDate: "1985-07-20",
    nationality: "Brasileira",
    maritalStatus: "Casado",
    occupation: "Empresário",
    monthlyIncome: 50000.00,
    
    // KYC e Compliance
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2025-09-20T16:45:00",
    kycExpiryDate: "2026-09-20",
    kycApprovedBy: "Pedro Santos",
    
    // Investimentos
    totalInvested: 184330.00,
    currentBalance: 196458.50,
    totalReturn: 12128.50,
    returnPercentage: 6.58,
    fundsCount: 2,
    
    // Metadata
    createdAt: "2025-09-10T10:15:00",
    lastActivity: "2025-10-14T11:30:00",
    status: "active"
  }
};

export const investorFundPositions: Record<string, any[]> = {
  "INV-001": [
    {
      fundId: "FUND-001",
      fundCode: "FIDC-ABC-I",
      fundName: "FIDC Multissetorial ABC I",
      quotaQuantity: 2500.5678,
      quotaValue: 1234.56,
      totalValue: 3087654.32,
      investmentDate: "2024-06-15",
      returnPercentage: 7.2,
      returnAmount: 207543.21,
      status: "active"
    },
    {
      fundId: "FUND-002",
      fundCode: "FIDC-XYZ-II",
      fundName: "FIDC Agro XYZ II",
      quotaQuantity: 1800.1234,
      quotaValue: 1456.78,
      totalValue: 2622345.67,
      investmentDate: "2024-08-20",
      returnPercentage: 6.5,
      returnAmount: 160123.45,
      status: "active"
    },
    {
      fundId: "FUND-003",
      fundCode: "FIDC-DEF-III",
      fundName: "FIDC Imobiliário DEF III",
      quotaQuantity: 500.0,
      quotaValue: 158.87,
      totalValue: 79435.00,
      investmentDate: "2025-01-10",
      returnPercentage: 2.1,
      returnAmount: 1635.00,
      status: "active"
    }
  ],
  "INV-002": [
    {
      fundId: "FUND-001",
      fundCode: "FIDC-ABC-I",
      fundName: "FIDC Multissetorial ABC I",
      quotaQuantity: 100.0,
      quotaValue: 1234.56,
      totalValue: 123456.00,
      investmentDate: "2025-09-15",
      returnPercentage: 1.8,
      returnAmount: 2182.00,
      status: "active"
    },
    {
      fundId: "FUND-004",
      fundCode: "FIDC-GHI-I",
      fundName: "FIDC Factoring GHI I",
      quotaQuantity: 60.0,
      quotaValue: 1217.51,
      totalValue: 73050.60,
      investmentDate: "2025-09-20",
      returnPercentage: 1.5,
      returnAmount: 1080.75,
      status: "active"
    }
  ]
};

export const investorDocuments: Record<string, any[]> = {
  "INV-001": [
    {
      id: "DOC-001",
      documentType: "contrato_social",
      documentName: "Contrato Social - ABC Investimentos",
      fileName: "contrato_social_abc.pdf",
      fileSize: 2456789,
      uploadDate: "2024-06-01T09:30:00",
      validationStatus: "approved",
      validatedBy: "Ana Costa",
      validatedAt: "2024-06-01T14:20:00",
      expiryDate: null
    },
    {
      id: "DOC-002",
      documentType: "cnpj",
      documentName: "Cartão CNPJ",
      fileName: "cnpj_abc.pdf",
      fileSize: 156789,
      uploadDate: "2024-06-01T09:32:00",
      validationStatus: "approved",
      validatedBy: "Ana Costa",
      validatedAt: "2024-06-01T14:20:00",
      expiryDate: null
    },
    {
      id: "DOC-003",
      documentType: "financial_statement",
      documentName: "Balanço Patrimonial 2023",
      fileName: "balanco_2023.pdf",
      fileSize: 3456789,
      uploadDate: "2024-06-01T10:15:00",
      validationStatus: "approved",
      validatedBy: "Ana Costa",
      validatedAt: "2024-06-02T09:30:00",
      expiryDate: "2025-06-01"
    },
    {
      id: "DOC-004",
      documentType: "proof_address",
      documentName: "Comprovante de Endereço",
      fileName: "comprovante_endereco.pdf",
      fileSize: 456789,
      uploadDate: "2024-06-01T09:35:00",
      validationStatus: "approved",
      validatedBy: "Ana Costa",
      validatedAt: "2024-06-01T14:20:00",
      expiryDate: "2025-06-01"
    }
  ],
  "INV-002": [
    {
      id: "DOC-005",
      documentType: "rg",
      documentName: "RG - João Silva Santos",
      fileName: "rg_joao_silva.pdf",
      fileSize: 1234567,
      uploadDate: "2025-09-10T10:30:00",
      validationStatus: "approved",
      validatedBy: "Pedro Santos",
      validatedAt: "2025-09-10T15:20:00",
      expiryDate: null
    },
    {
      id: "DOC-006",
      documentType: "cpf",
      documentName: "CPF - João Silva Santos",
      fileName: "cpf_joao_silva.pdf",
      fileSize: 234567,
      uploadDate: "2025-09-10T10:31:00",
      validationStatus: "approved",
      validatedBy: "Pedro Santos",
      validatedAt: "2025-09-10T15:20:00",
      expiryDate: null
    },
    {
      id: "DOC-007",
      documentType: "proof_address",
      documentName: "Comprovante de Residência",
      fileName: "comprovante_residencia.pdf",
      fileSize: 567890,
      uploadDate: "2025-09-10T10:32:00",
      validationStatus: "approved",
      validatedBy: "Pedro Santos",
      validatedAt: "2025-09-10T15:20:00",
      expiryDate: "2026-03-10"
    },
    {
      id: "DOC-008",
      documentType: "income_proof",
      documentName: "Comprovante de Renda",
      fileName: "comprovante_renda.pdf",
      fileSize: 890123,
      uploadDate: "2025-09-10T10:35:00",
      validationStatus: "approved",
      validatedBy: "Pedro Santos",
      validatedAt: "2025-09-10T15:20:00",
      expiryDate: "2026-09-10"
    }
  ]
};

export const investorComplianceChecks: Record<string, any[]> = {
  "INV-001": [
    {
      id: "CHK-001",
      checkType: "pep",
      checkName: "Verificação PEP (Pessoa Exposta Politicamente)",
      checkDate: "2024-06-01T16:00:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Nenhuma correspondência encontrada em bases PEP",
      dataSource: "Serasa Compliance",
      performedBy: "Sistema"
    },
    {
      id: "CHK-002",
      checkType: "sanctions",
      checkName: "Listas Restritivas e Sanções",
      checkDate: "2024-06-01T16:05:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Nenhuma correspondência em listas de sanções internacionais",
      dataSource: "World-Check",
      performedBy: "Sistema"
    },
    {
      id: "CHK-003",
      checkType: "adverse_media",
      checkName: "Mídia Adversa",
      checkDate: "2024-06-01T16:10:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Nenhuma notícia adversa relevante encontrada",
      dataSource: "Google News API",
      performedBy: "Sistema"
    },
    {
      id: "CHK-004",
      checkType: "credit_bureau",
      checkName: "Consulta Bureau de Crédito",
      checkDate: "2024-06-01T16:15:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Score: 850/1000. Sem protestos ou negativações",
      dataSource: "Serasa Experian",
      performedBy: "Sistema"
    }
  ],
  "INV-002": [
    {
      id: "CHK-005",
      checkType: "pep",
      checkName: "Verificação PEP",
      checkDate: "2025-09-10T16:00:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Nenhuma correspondência encontrada",
      dataSource: "Serasa Compliance",
      performedBy: "Sistema"
    },
    {
      id: "CHK-006",
      checkType: "sanctions",
      checkName: "Listas Restritivas",
      checkDate: "2025-09-10T16:05:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Nenhuma correspondência em listas de sanções",
      dataSource: "World-Check",
      performedBy: "Sistema"
    },
    {
      id: "CHK-007",
      checkType: "credit_bureau",
      checkName: "Consulta Bureau de Crédito",
      checkDate: "2025-09-10T16:10:00",
      checkResult: "clear",
      riskLevel: "low",
      findings: "Score: 720/1000. Histórico positivo",
      dataSource: "Serasa Experian",
      performedBy: "Sistema"
    }
  ]
};

export const investorActivityHistory: Record<string, any[]> = {
  "INV-001": [
    {
      id: "ACT-001",
      activityType: "subscription",
      description: "Aplicação em FIDC-ABC-I",
      amount: 3000000.00,
      quotaQuantity: 2500.5678,
      fundName: "FIDC Multissetorial ABC I",
      timestamp: "2024-06-15T10:30:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-002",
      activityType: "subscription",
      description: "Aplicação em FIDC-XYZ-II",
      amount: 2500000.00,
      quotaQuantity: 1800.1234,
      fundName: "FIDC Agro XYZ II",
      timestamp: "2024-08-20T14:15:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-003",
      activityType: "kyc_renewal",
      description: "Renovação de KYC aprovada",
      timestamp: "2024-08-15T10:30:00",
      performedBy: "Ana Costa",
      status: "completed"
    },
    {
      id: "ACT-004",
      activityType: "subscription",
      description: "Aplicação em FIDC-DEF-III",
      amount: 80000.00,
      quotaQuantity: 500.0,
      fundName: "FIDC Imobiliário DEF III",
      timestamp: "2025-01-10T09:45:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-005",
      activityType: "document_update",
      description: "Atualização de comprovante de endereço",
      timestamp: "2025-10-10T14:20:00",
      performedBy: "Maria Silva",
      status: "completed"
    }
  ],
  "INV-002": [
    {
      id: "ACT-006",
      activityType: "onboarding",
      description: "Onboarding aprovado",
      timestamp: "2025-09-20T16:45:00",
      performedBy: "Pedro Santos",
      status: "completed"
    },
    {
      id: "ACT-007",
      activityType: "subscription",
      description: "Primeira aplicação em FIDC-ABC-I",
      amount: 125000.00,
      quotaQuantity: 100.0,
      fundName: "FIDC Multissetorial ABC I",
      timestamp: "2025-09-15T11:30:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-008",
      activityType: "subscription",
      description: "Aplicação em FIDC-GHI-I",
      amount: 75000.00,
      quotaQuantity: 60.0,
      fundName: "FIDC Factoring GHI I",
      timestamp: "2025-09-20T15:00:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-009",
      activityType: "communication",
      description: "Relatório mensal enviado",
      timestamp: "2025-10-01T08:00:00",
      performedBy: "Sistema",
      status: "completed"
    },
    {
      id: "ACT-010",
      activityType: "communication",
      description: "Relatório mensal enviado",
      timestamp: "2025-10-14T08:00:00",
      performedBy: "Sistema",
      status: "completed"
    }
  ]
};

// ============= AGENT / CHAT DATA =============

export const conversationsData = [
  {
    id: "conv-001",
    userId: "user-001",
    title: "Análise de inadimplência e cobrança",
    createdAt: "2025-10-15T09:00:00",
    updatedAt: "2025-10-15T09:05:30",
    lastMessageAt: "2025-10-15T09:05:30",
    messageCount: 6
  },
  {
    id: "conv-002",
    userId: "user-001",
    title: "Status de conciliação bancária",
    createdAt: "2025-10-14T14:20:00",
    updatedAt: "2025-10-14T14:28:15",
    lastMessageAt: "2025-10-14T14:28:15",
    messageCount: 8
  },
  {
    id: "conv-003",
    userId: "user-001",
    title: "Resumo de métricas e KPIs",
    createdAt: "2025-10-13T10:15:00",
    updatedAt: "2025-10-13T10:22:45",
    lastMessageAt: "2025-10-13T10:22:45",
    messageCount: 10
  },
  {
    id: "conv-004",
    userId: "user-001",
    title: "Pipeline de onboarding de investidores",
    createdAt: "2025-10-12T16:30:00",
    updatedAt: "2025-10-12T16:35:20",
    lastMessageAt: "2025-10-12T16:35:20",
    messageCount: 4
  },
  {
    id: "conv-005",
    userId: "user-001",
    title: "Análise de exposição por cedente",
    createdAt: "2025-10-10T11:45:00",
    updatedAt: "2025-10-10T11:52:30",
    lastMessageAt: "2025-10-10T11:52:30",
    messageCount: 7
  }
];

export const messagesData: Record<string, any[]> = {
  "conv-001": [
    {
      id: "msg-001",
      conversationId: "conv-001",
      role: "assistant",
      content: "Olá! Como posso ajudá-lo hoje?",
      createdAt: "2025-10-15T09:00:00"
    },
    {
      id: "msg-002",
      conversationId: "conv-001",
      role: "user",
      content: "Qual é o valor total de recebíveis vencidos hoje?",
      createdAt: "2025-10-15T09:01:15"
    },
    {
      id: "msg-003",
      conversationId: "conv-001",
      role: "assistant",
      content: "Analisando os dados...\n\n**Recebíveis Vencidos Hoje (15/10/2025)**\n\n• Total: 23 recebíveis\n• Valor: R$ 1.847.500,00\n\n**Principais sacados:**\n1. Empresa XYZ: R$ 450.000 (3 recebíveis)\n2. Comércio ABC: R$ 380.000 (2 recebíveis)\n3. Distribuidora DEF: R$ 290.000 (1 recebível)\n\nDeseja que eu crie alertas de cobrança para estes casos?",
      createdAt: "2025-10-15T09:01:18"
    },
    {
      id: "msg-004",
      conversationId: "conv-001",
      role: "user",
      content: "Sim, quais são os 3 casos mais críticos?",
      createdAt: "2025-10-15T09:03:20"
    },
    {
      id: "msg-005",
      conversationId: "conv-001",
      role: "assistant",
      content: "**Top 3 Casos Mais Críticos:**\n\n**1. Empresa XYZ Ltda**\n• Valor: R$ 150.000\n• Dias de atraso: 7 dias\n• Histórico: 2 promessas não cumpridas\n• Risco: CRÍTICO 🔴\n• Ação sugerida: Contato jurídico imediato\n\n**2. Comércio ABC S.A.**\n• Valor: R$ 125.000\n• Dias de atraso: 5 dias\n• Score de crédito: Caiu de 720 para 580\n• Risco: ALTO 🟠\n• Ação sugerida: Ligação do gestor + carta de cobrança\n\n**3. Distribuidora DEF**\n• Valor: R$ 95.000\n• Dias de atraso: 3 dias\n• Primeiro atraso deste cliente\n• Risco: MÉDIO 🟡\n• Ação sugerida: WhatsApp + email de lembrete\n\nPosso criar workflows de cobrança automáticos para estes casos?",
      createdAt: "2025-10-15T09:03:25"
    },
    {
      id: "msg-006",
      conversationId: "conv-001",
      role: "user",
      content: "Perfeito, crie os workflows",
      createdAt: "2025-10-15T09:05:30"
    }
  ],
  "conv-002": [
    {
      id: "msg-007",
      conversationId: "conv-002",
      role: "assistant",
      content: "Olá! Como posso ajudá-lo hoje?",
      createdAt: "2025-10-14T14:20:00"
    },
    {
      id: "msg-008",
      conversationId: "conv-002",
      role: "user",
      content: "Qual o status da conciliação bancária de hoje?",
      createdAt: "2025-10-14T14:21:30"
    },
    {
      id: "msg-009",
      conversationId: "conv-002",
      role: "assistant",
      content: "**Status de Conciliação - 14/10/2025**\n\n✅ **Conciliados Automaticamente:** 1.652 transações (92,1%)\n\n⏳ **Pendentes de Revisão:** 112 transações (6,2%)\n• Valor total: R$ 3,2M\n• Principais causas:\n  - Pagamentos parciais: 45 casos\n  - Valores com diferença: 38 casos\n  - Origem não identificada: 29 casos\n\n❌ **Não Identificados:** 31 transações (1,7%)\n• Valor total: R$ 890k\n• Requer ação manual urgente\n\n**Eficiência geral:** 92,1% (↑1,2% vs ontem)\n\nDeseja ver detalhes das pendências?",
      createdAt: "2025-10-14T14:21:35"
    },
    {
      id: "msg-010",
      conversationId: "conv-002",
      role: "user",
      content: "Sim, mostre as 5 pendências de maior valor",
      createdAt: "2025-10-14T14:23:10"
    },
    {
      id: "msg-011",
      conversationId: "conv-002",
      role: "assistant",
      content: "**Top 5 Pendências por Valor:**\n\n1. TED R$ 450.000,00 - 14/10\n   • Origem: CNPJ 12.345.678/0001-90\n   • Problema: Empresa não cadastrada\n   • Ação: Verificar com cedente\n\n2. PIX R$ 320.000,00 - 14/10\n   • Origem: Industria ABC LTDA\n   • Problema: Pagamento parcial (esperado R$ 500k)\n   • Ação: Solicitar complemento\n\n3. TED R$ 280.000,00 - 13/10\n   • Origem: CNPJ 98.765.432/0001-11\n   • Problema: Diferença de R$ 50 (juros?)\n   • Ação: Aceitar com ajuste\n\n4. PIX R$ 185.000,00 - 14/10\n   • Origem: Comercio XYZ S.A.\n   • Problema: Data divergente (2 dias adiantado)\n   • Ação: Conciliar manualmente\n\n5. TED R$ 150.000,00 - 14/10\n   • Origem: Nome truncado \"EMPRESA DE...\"\n   • Problema: Identificação incompleta\n   • Ação: Buscar por valor e data\n\nTotal das 5 pendências: R$ 1.385.000,00\n\nPosso sugerir ações automáticas para cada caso?",
      createdAt: "2025-10-14T14:23:18"
    }
  ],
  "conv-003": [
    {
      id: "msg-012",
      conversationId: "conv-003",
      role: "assistant",
      content: "Olá! Como posso ajudá-lo hoje?",
      createdAt: "2025-10-13T10:15:00"
    },
    {
      id: "msg-013",
      conversationId: "conv-003",
      role: "user",
      content: "Me dê um resumo das principais métricas de hoje",
      createdAt: "2025-10-13T10:16:20"
    },
    {
      id: "msg-014",
      conversationId: "conv-003",
      role: "assistant",
      content: "**📊 Resumo Executivo - 13/10/2025**\n\n**Patrimônio e Performance**\n• AuM Total: R$ 234,5M (↑2,3% no mês)\n• Rentabilidade média: CDI + 2,8%\n• Fundos ativos: 8\n\n**Operacional**\n• Recebíveis ativos: 1.823\n• Valor total: R$ 187,3M\n• Vencimentos hoje: 45 (R$ 8,2M)\n• Conciliação: 93,8%\n\n**Risco e Inadimplência**\n• Taxa de inadimplência: 2,1% (↓0,2%)\n• Valor em atraso: R$ 4,8M\n• Alertas críticos: 3\n• Exposição top 5 cedentes: 42,3%\n\n**Investidores**\n• Total: 247 investidores\n• Aplicações hoje: R$ 1,2M (2 investidores)\n• Resgates pendentes: R$ 450k (1 investidor)\n• Pipeline onboarding: 4\n\n**Destaques do Dia**\n🟢 Novo fundo captou R$ 15M\n🟡 2 cedentes aguardando renovação de limite\n🔴 1 recebível de R$ 200k com 10 dias de atraso\n\nDeseja detalhes de alguma área específica?",
      createdAt: "2025-10-13T10:16:28"
    }
  ],
  "conv-004": [
    {
      id: "msg-015",
      conversationId: "conv-004",
      role: "assistant",
      content: "Olá! Como posso ajudá-lo hoje?",
      createdAt: "2025-10-12T16:30:00"
    },
    {
      id: "msg-016",
      conversationId: "conv-004",
      role: "user",
      content: "Quantos investidores estão no pipeline de onboarding?",
      createdAt: "2025-10-12T16:32:15"
    },
    {
      id: "msg-017",
      conversationId: "conv-004",
      role: "assistant",
      content: "**Pipeline de Onboarding - 12/10/2025**\n\n**Total:** 5 investidores em processo\n\n**Por Status:**\n• 📝 Documentação pendente: 2\n• 🔍 Em análise de compliance: 2\n• ✅ Aguardando aprovação final: 1\n\n**Detalhamento:**\n\n1. **Maria Oliveira Costa** (PF)\n   • Status: Documentação pendente\n   • Tempo no processo: 1 dia\n   • Pendências: Comprovante de residência\n   • SLA: 2 dias restantes\n\n2. **Tech Ventures LTDA** (PJ)\n   • Status: Documentação pendente\n   • Tempo no processo: 2 dias\n   • Pendências: Contrato social atualizado\n   • SLA: 1 dia restante ⚠️\n\n3. **Carlos Eduardo Ferreira** (PF)\n   • Status: Análise de compliance\n   • Tempo no processo: 4 dias\n   • Atribuído a: Ana Costa\n   • SLA: 3 dias restantes\n\n4. **Holding Investments S.A.** (PJ)\n   • Status: Análise de compliance\n   • Tempo no processo: 3 dias\n   • Atribuído a: Ana Costa\n   • SLA: 4 dias restantes\n\n5. **Roberto Almeida** (PF)\n   • Status: Aprovação final\n   • Tempo no processo: 8 dias\n   • Aprovação prevista: Hoje\n\nDeseja ver detalhes de algum investidor específico?",
      createdAt: "2025-10-12T16:32:22"
    }
  ],
  "conv-005": [
    {
      id: "msg-018",
      conversationId: "conv-005",
      role: "assistant",
      content: "Olá! Como posso ajudá-lo hoje?",
      createdAt: "2025-10-10T11:45:00"
    },
    {
      id: "msg-019",
      conversationId: "conv-005",
      role: "user",
      content: "Mostre a exposição de risco por cedente",
      createdAt: "2025-10-10T11:46:30"
    },
    {
      id: "msg-020",
      conversationId: "conv-005",
      role: "assistant",
      content: "**Exposição por Cedente - Top 10**\n\n**Concentração Total:** R$ 187,3M\n**Limite de concentração individual:** 15%\n\n1. **Fornecedor ABC S.A.**\n   • Exposição: R$ 28,5M (15,2%) 🔴 ACIMA DO LIMITE\n   • Recebíveis: 156\n   • Score: 780\n   • Rating: AA\n   • Ação: Reduzir exposição em R$ 500k\n\n2. **Distribuidora XYZ Ltda**\n   • Exposição: R$ 24,8M (13,2%)\n   • Recebíveis: 134\n   • Score: 720\n   • Rating: A\n\n3. **Indústria DEF S.A.**\n   • Exposição: R$ 19,3M (10,3%)\n   • Recebíveis: 98\n   • Score: 850\n   • Rating: AAA\n\n4. **Atacadista GHI Ltda**\n   • Exposição: R$ 16,7M (8,9%)\n   • Recebíveis: 87\n   • Score: 690\n   • Rating: BBB\n\n5. **Comercial JKL S.A.**\n   • Exposição: R$ 14,2M (7,6%)\n   • Recebíveis: 72\n   • Score: 750\n   • Rating: A\n\n*Top 5 representa 55,2% da carteira*\n\n6. Varejista MNO: R$ 11,8M (6,3%)\n7. Logística PQR: R$ 9,4M (5,0%)\n8. Factoring STU: R$ 7,9M (4,2%)\n9. Agrícola VWX: R$ 6,5M (3,5%)\n10. Serviços YZ: R$ 5,8M (3,1%)\n\n**Alertas:**\n🔴 Fornecedor ABC: acima do limite\n🟡 Distribuidora XYZ: próximo ao limite (13,2%)\n\nRecomendação: Diversificar aquisições nos próximos 30 dias.\n\nDeseja análise detalhada de algum cedente?",
      createdAt: "2025-10-10T11:46:40"
    }
  ]
};

export const botAutoResponses = {
  resumo: "**📊 Resumo Rápido**\n\n• Recebíveis ativos: 1.847\n• Conciliação hoje: 94,2%\n• Taxa inadimplência: 2,3%\n• Alertas críticos: 5\n• Investidores: 247\n\nDeseja detalhes de alguma área?",
  
  conciliacao: "**Status Conciliação**\n\n✅ Automático: 92%\n⏳ Revisão: 6%\n❌ Não identificado: 2%\n\nTotal processado: 1.795 transações",
  
  inadimplencia: "**Inadimplência Atual**\n\n• Taxa: 2,3%\n• Valor: R$ 5,4M\n• Casos críticos: 5\n• Casos em cobrança: 23\n\nTop 3 por valor:\n1. Empresa XYZ: R$ 320k\n2. Atacadista ABC: R$ 280k\n3. Comércio DEF: R$ 185k",
  
  investidores: "**Investidores**\n\n• Total: 247\n• Onboarding: 5 em processo\n• Aplicações hoje: R$ 850k\n• Resgates pendentes: 2 (R$ 620k)",
  
  default: "Entendi sua pergunta. Posso ajudá-lo com:\n\n• Resumos e métricas\n• Status de conciliação\n• Análise de inadimplência\n• Informações de investidores\n• Exposição de risco\n\nPor favor, seja mais específico ou escolha um dos tópicos acima."
};
