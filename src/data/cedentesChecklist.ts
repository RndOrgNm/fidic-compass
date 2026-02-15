import type { CedentePipelineStatus } from "./pipelineData";

/**
 * Canonical checklists for each Cedentes pipeline status.
 * A card can only advance to the next status when its pending_items is empty
 * (all items in the current status's checklist are completed).
 * Backend will store pending_items per cedente; these define the full checklist per status.
 */
export const CEDENTES_CHECKLIST: Record<CedentePipelineStatus, string[]> = {
  lead: [
    "Qualificação Setorial: Verificar se o CNAE da empresa é aceito pelos regulamentos dos FIDCs ativos.",
    "Estimativa de Volume: Confirmar se o volume mensal de recebíveis atende ao ticket mínimo da operação.",
    "Check de Fit: Garantir que o cedente entende o modelo de antecipação e quer operar via FIDC.",
    "Triagem de Concentração: Verificar se o cedente já opera com outros FIDCs concorrentes (risco de duplicidade).",
  ],
  due_diligence: [
    "Análise de Balanço/DRE: Avaliar a saúde financeira dos últimos 2 ou 3 anos.",
    "Bureau de Crédito: Consultar Serasa/Boa Vista do CNPJ e dos sócios.",
    "KYC e Compliance: Pesquisa de mídia negativa, processos judiciais e listas restritivas (AML/PLD).",
    "Perfil dos Sacados: Analisar a qualidade de quem paga as notas (os devedores do cedente).",
    "Aprovação em Comitê: Registrar o parecer favorável (ou ressalvas) dos tomadores de decisão.",
  ],
  documentacao_pendente: [
    "Contrato de Cessão (Mãe): Coletar assinatura digital do contrato principal e aditivos.",
    "Documentos Societários: Validar Contrato Social atualizado e procurações.",
    "Domicílio Bancário: Configurar a conta onde os sacados deverão pagar os boletos (trava bancária).",
    "Garantias Adicionais: Formalizar avais, alienações fiduciárias ou fundos de reserva, se houver.",
    "Configuração no ERP/Custodiante: Garantir que o cedente está cadastrado no sistema do custodiante do fundo.",
  ],
  cedente_ativo: [
    "Primeira Operação: Validar o primeiro borderô (lote de títulos) enviado.",
    "Monitoramento de Limite: Checar se a exposição do cedente está dentro do limite aprovado.",
    "Re-rating Periódico: Agendar a próxima análise de crédito (geralmente a cada 6 ou 12 meses).",
    "Verificação de Lastro: Realizar checagens recorrentes se as notas fiscais emitidas são reais.",
  ],
  bloqueado_desistencia: [
    "Motivo da Saída: Registrar se foi por risco (bloqueio) ou por vontade do cliente (desistência).",
    "Check de Recompra: Verificar se existem títulos vencidos que o cedente ainda precisa pagar/recomprar.",
    "Baixa em Garantias: Liberar travas bancárias ou garantias caso a relação tenha sido encerrada sem dívidas.",
    "Blacklist Interna: Marcar o CNPJ para que não entre novamente no pipeline de Lead sem um alerta de segurança.",
  ],
};
