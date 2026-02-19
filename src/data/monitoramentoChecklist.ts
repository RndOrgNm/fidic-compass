import type { MonitoramentoPipelineStatus } from "./pipelineData";

/**
 * Canonical checklists for each Monitoramento pipeline status.
 * A card can only advance when pending_items is empty.
 */
export const MONITORAMENTO_CHECKLIST: Record<MonitoramentoPipelineStatus, string[]> = {
  alertas_deteccao: [
    "Check de Concentração: Alertar se um único sacado ou cedente ultrapassou o percentual máximo permitido no fundo.",
    "Alerta de Recompra: Detectar títulos vencidos que ainda não foram recomprados pelo cedente conforme contrato.",
    "Vencimento de Garantias: Identificar se algum aval, seguro ou garantia real está próximo do vencimento ou precisa de renovação.",
    "Inconsistência de Lastro: Cruzar dados com a SEFAZ para verificar se alguma nota fiscal foi cancelada após a cessão.",
  ],
  correcoes_acoes: [
    "Notificação ao Cedente: Formalizar o pedido de esclarecimento ou a solicitação de recompra de títulos.",
    "Acionamento de Cobrança: Iniciar régua de cobrança (e-mail, telefone, SMS) para os sacados em atraso.",
    "Bloqueio de Novos Limites: Travar a entrada de novos recebíveis daquele cedente até a regularização do alerta.",
    "Execução de Garantias: Iniciar os trâmites jurídicos ou administrativos para execução de colaterais, se necessário.",
    "Repactuação / Prorrogação: Registrar se houve acordo de novos prazos, garantindo a atualização das taxas.",
  ],
  relatorios_em_andamento: [
    "Boletim de Desempenho: Consolidar a rentabilidade (Yield) do fundo versus o benchmark (ex: CDI + %).",
    "Relatório de Inadimplência: Detalhar o aging (idade da dívida) por faixas de atraso (1-15 dias, 16-30, etc.).",
    "Extrato de Enquadramento: Documentar que o fundo respeitou todos os limites do regulamento no período.",
    "Preenchimento de Informes Legais: Preparar os dados para o Informe Mensal da CVM ou informes ao custodiante.",
  ],
  em_conformidade_auditoria: [
    "Revisão do Custodiante: Validar se o custodiante do fundo aprovou as movimentações e as baixas de títulos.",
    "Check de Auditoria Externa: Separar amostras de lastro e contratos para auditorias periódicas obrigatórias.",
    "Validação de Compliance: Confirmar que nenhuma ação de cobrança ou correção feriu as normas de PLD (Prevenção à Lavagem de Dinheiro).",
    "Assinatura de Parecer: Coleta de assinatura do responsável pelo risco/compliance sobre o status da carteira.",
  ],
  encerrado: [
    "Arquivamento do Dossiê: Salvar todo o histórico de alertas e correções do mês para consultas futuras.",
    "Liberação de Provisionamento: Ajustar as provisões de perda no sistema contábil caso os riscos tenham sido sanados.",
    "Update de Rating: Atualizar a nota de crédito (rating) do cedente ou do próprio fundo com base nos eventos monitorados.",
    "Preparação do Próximo Ciclo: Zerar os gatilhos temporários para iniciar o monitoramento do novo mês.",
  ],
};
