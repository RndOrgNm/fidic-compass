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
    
    foundingDate: "2018-03-15",
    shareCapital: 10000000.00,
    mainActivity: "Gestão de investimentos e participações",
    legalRepresentative: "Carlos Alberto Silva",
    legalRepCpf: "123.456.789-00",
    
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2024-08-15T10:30:00",
    kycExpiryDate: "2025-12-31",
    kycApprovedBy: "Ana Costa",
    
    totalInvested: 5420000.00,
    currentBalance: 5789430.00,
    totalReturn: 369430.00,
    returnPercentage: 6.82,
    fundsCount: 3,
    
    createdAt: "2024-06-01T09:00:00",
    lastActivity: "2025-10-10T14:20:00",
    status: "active"
  },
  "INV-002": {
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
    
    birthDate: "1985-07-20",
    nationality: "Brasileira",
    maritalStatus: "Casado",
    occupation: "Empresário",
    monthlyIncome: 50000.00,
    
    riskProfile: "moderate",
    kycStatus: "approved",
    kycCompletedAt: "2025-09-20T16:45:00",
    kycExpiryDate: "2026-09-20",
    kycApprovedBy: "Pedro Santos",
    
    totalInvested: 184330.00,
    currentBalance: 196458.50,
    totalReturn: 12128.50,
    returnPercentage: 6.58,
    fundsCount: 2,
    
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
