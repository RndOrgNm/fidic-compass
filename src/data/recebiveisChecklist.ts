import type { RecebivelStatus } from "@/lib/api/prospectionService";

/**
 * Fallback checklist when GET /recebiveis/checklist fails.
 * Backend (funds-pipeline/src/data/checklists.py) is the source of truth.
 */
export const RECEBIVEIS_CHECKLIST: Record<RecebivelStatus, string[]> = {
  identificados: [
    "Integridade do Arquivo: Validar se o XML da nota fiscal ou o arquivo de remessa está no padrão correto e sem erros de leitura.",
    "Cheque de Duplicidade: O sistema deve varrer todos os seus FIDCs para garantir que esse mesmo título não foi vendido para outro fundo da casa (ou se já foi comprado antes).",
    "Check de Limite Disponível: Verificar se o valor deste lote cabe dentro do \"Limite Aprovado\" que definimos lá no pipeline de Cedentes.",
    "Verificação de Sacado (Devedor): Identificar se o sacado (quem paga) já está cadastrado ou se precisa de uma análise de crédito rápida.",
  ],
  due_diligence: [
    "Consulta SEFAZ: Verificar se a nota fiscal está \"Autorizada\" e não foi cancelada ou substituída.",
    "Validação de Lastro (Canhoto/CTE): Confirmar se a mercadoria foi entregue ou o serviço prestado (anexar evidência digital).",
    "Confirmação (Checagem): Realizar o contato com o sacado (via e-mail, portal ou telefone) para que ele confirme que a dívida existe e será paga ao FIDC.",
    "Rating do Recebível: Atribuir uma nota de risco específica para este título, cruzando o risco do cedente com o risco do sacado.",
  ],
  custodia_registro: [
    "Registro em Registradora (B3, Cerc, Tag): Efetuar o registro do ativo na registradora central para garantir a unicidade e evitar que seja vendido para terceiros.",
    "Emissão do Termo de Cessão: Gerar o documento jurídico que transfere a propriedade do cedente para o fundo.",
    "Envio ao Custodiante: Notificar o banco custodiante sobre a nova aquisição para validação da carteira.",
    "Liquidação Financeira: Comandar o pagamento (TED/Pix) para a conta do cedente, descontando as taxas (deságio).",
    "Instrução de Cobrança: Gerar e enviar o boleto/instrução de pagamento para o sacado com os dados da conta do FIDC.",
  ],
  inadimplencia_risco: [
    "Identificação de Atraso (D+1): Mover automaticamente para cá títulos que não tiveram baixa bancária no dia do vencimento.",
    "Análise de Causa: Identificar se é uma falha operacional (pagou mas o banco não baixou) ou risco de crédito real.",
    "Notificação de Recompra: Solicitar ao cedente que recompre o título (conforme contrato) para manter a saúde do fundo.",
    "Ajuizamento/Cobrança Extrajudicial: Iniciar protestos ou ações judiciais caso a recompra não ocorra.",
    "Provisão de Perda (PDD): Ajustar o valor do título no balanço do fundo conforme as regras de provisionamento por atraso.",
  ],
  encerrado: [
    "Baixa por Liquidação: Registro do recebimento total do valor pelo sacado.",
    "Baixa por Recompra: Registro de que o cedente pagou o fundo para \"pegar de volta\" o título inadimplente.",
    "Cálculo de Rentabilidade Real: Comparar a taxa acordada com o que foi efetivamente recebido (considerando multas ou atrasos).",
    "Alimentação do Histórico: Atualizar o comportamento do cedente e do sacado para que a próxima análise de crédito seja mais precisa.",
  ],
  rejeitado: [],
};
