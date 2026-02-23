import type { ProspectionStatus } from "@/lib/api/prospectionService";

/**
 * Fallback checklist when GET /recebiveis/checklist fails.
 * Backend (funds-pipeline/src/data/checklists.py) is the source of truth.
 */
export const RECEBIVEIS_CHECKLIST: Record<ProspectionStatus, string[]> = {
  lead: [
    "Primeiro Contato: Estabelecer contato inicial com o cedente para qualificação.",
    "Qualificação Setorial: Verificar se o CNAE e segmento são elegíveis para FIDC.",
    "Estimativa de Volume: Confirmar volume mensal de recebíveis e ticket mínimo.",
    "Check de Fit: Validar interesse do cedente no modelo de antecipação via FIDC.",
  ],
  contact: [
    "Envio de Proposta: Encaminhar proposta comercial com taxas e condições.",
    "Reunião de Alinhamento: Realizar reunião para esclarecer o modelo operacional.",
    "Coleta de Documentos Iniciais: Solicitar CNPJ, faturamento e portfólio de sacados.",
    "NDA/Confidencialidade: Formalizar acordo de confidencialidade antes de enviar documentação sensível.",
  ],
  documents: [
    "Contrato Social: Validar contrato social atualizado e procurações dos signatários.",
    "Balanços e DRE: Coletar balanços dos últimos 2–3 anos para análise financeira.",
    "Comprovante de Faturamento: Notas fiscais, extrato bancário ou relatório do ERP.",
    "Lista de Sacados: Relação de principais sacados com volumes e concentração.",
  ],
  credit_analysis: [
    "Bureau de Crédito: Consultar Serasa/Boa Vista do CNPJ e dos sócios.",
    "KYC e Compliance: Pesquisa de mídia negativa, processos judiciais e listas restritivas.",
    "Análise de Lastro: Avaliar qualidade e histórico de inadimplência dos sacados.",
    "Parecer do Comitê: Registrar parecer do comitê de crédito (aprovado, aprovado com ressalvas ou rejeitado).",
  ],
  approved: [],
  rejected: [],
};
