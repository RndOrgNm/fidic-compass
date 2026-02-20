import type { AllocationStatus } from "@/lib/api/allocationService";

/**
 * Canonical checklists for each Alocação pipeline status.
 * A card can only advance when pending_items is empty.
 */
export const ALLOCATION_CHECKLIST: Record<AllocationStatus, string[]> = {
  pending_match: [
    "Verificação de elegibilidade: Conferir se o recebível atende aos critérios do fundo.",
    "Match de taxas: Alinhar taxa de antecipação com expectativa do cedente.",
    "Análise de concentração: Verificar limites de sacado e cedente no fundo.",
  ],
  fund_selection: [
    "Identificação de fundos elegíveis: Listar fundos que aceitam o segmento e ticket.",
    "Comparativo de taxas: Montar tabela comparativa de taxas e prazos.",
    "Proposta ao cedente: Encaminhar proposta com fundo e condições selecionadas.",
  ],
  compliance_check: [
    "KYC do sacado: Validar dados cadastrais e documentação do sacado.",
    "Checagem de listas restritivas: Pesquisar mídia negativa e listas restritivas.",
    "Aprovação do compliance: Obter parecer formal do compliance.",
  ],
  allocated: [],
  rejected: [],
  withdrawn: [],
  superseded: [],
};
