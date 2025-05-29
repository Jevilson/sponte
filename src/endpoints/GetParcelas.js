const api = require("../api");
const convertToJSON = require("../utils/convertToJSON");
const normalizeRetorno = require("../utils/normalizeRetorno");
const validateParams = require("../utils/validators");

/**
 * Método visa consultar os dados das parcelas ou dos planos de parcelamentos dos alunos.
 *
 * @async
 * @function getParcelas
 * @param {Object} params - Parâmetros da requisição.
 * @param {string} params.nCodigoCliente - Código do cliente. Obrigatório.
 * @param {string} params.sToken - Token de autenticação. Obrigatório.
 * @param {string} params.sParametrosBusca. Obrigatório.  - Parâmetros opcionais de busca no formato: `Nome_Parâmetro=Campo_Busca;Nome_Parâmetro2=Campo_Busca2`.
 *
 * Parâmetros possíveis:
 * - CNABID (Integer) - Código da Configuração de cobrança
 * - ResponsavelID (Integer) - Código do responsável
 * - NumeroBoleto (Integer) - Número do boleto
 * - ContaReceberID (Integer) - Código do plano
 * - AlunoID (Integer) - Código do aluno
 * - ContratoID (Integer) - Código do contrato de Turma
 * - ContratoAulaLivreID (Integer) - Código do contrato do tipo de matrícula de aulas livres
 * - TipoPlanoContrato (Integer) - Tipo do plano (0=Mensalidade, 1=Material, 2=Matrícula, 3=Outros Planos)
 * - NumeroParcela (Integer) - Número da parcela do plano
 * - DataVencimento (Date) - Data de vencimento da parcela (YYYY/MM/DD ou YYYY/MM/DD e YYYY/MM/DD)
 * - DataPagamento (Date) - Data de pagamento da parcela (YYYY/MM/DD ou YYYY/MM/DD e YYYY/MM/DD)
 * - DataCompetencia (Date) - Data de competência do plano (YYYY/MM/DD ou YYYY/MM/DD e YYYY/MM/DD)
 * - DataInclusao (Date) - Data de inclusão do plano (YYYY/MM/DD ou YYYY/MM/DD e YYYY/MM/DD)
 * - FormaCobranca (Integer/String) - Código ou nome da forma de cobrança
 * - FormaRecebimento (Integer/String) - Código ou nome do tipo de recebimento
 * - Sacado (Integer/String) - Código ou nome do Aluno/Cliente
 * - Categoria (Integer/String) - Código ou nome da categoria
 * - Situacao (Integer) - Código da situação (0=Pendente, 1=Quitada, 2=Cancelada)
 * - BolsaID (Integer) - Código da bolsa
 * - ParcelasDeBolsistas (Integer) - 1 para parcelas com bolsa, 0 para sem bolsa
 * - SomenteRecebidasEmAtraso (Integer) - 1 para parcelas recebidas em atraso, 0 para em dia
 * - Valor (Double) - Valor da parcela (valor único ou intervalo)
 *
 * @returns {Promise<{ error: boolean, message: string, data: Array }>}
 */
async function getParcelas({ nCodigoCliente, sToken, sParametrosBusca }) {
  const validationRules = [
    {
      field: "sToken",
      validate: (v) => typeof v === "string" && v.trim() !== "",
      message: "Token inválido.",
    },
    {
      field: "nCodigoCliente",
      validate: (v) => typeof v === "string" && v.trim() !== "",
      message: "Cliente não encontrado, verifique o código do cliente informado.",
    },
    {
      field: "sParametrosBusca",
      validate: (v) => typeof v === "string" && v.trim() !== "",
      message: "Parâmetros de busca inválidos.",
    },
  ];

  const validationError = validateParams(
    { nCodigoCliente, sToken, sParametrosBusca },
    validationRules
  );

  if (validationError) return validationError;

  try {
    const response = await api.get("/GetParcelas", {
      params: { nCodigoCliente, sToken, sParametrosBusca },
    });

    const json = convertToJSON(response.data);
    const data = json?.ArrayOfWsParcela?.wsParcela;

    if (!data) {
      return { error: true, message: "Resposta inesperada do servidor.", data: [] };
    }

    if (Array.isArray(data)) {
      return {
        error: false,
        message: data[0]?.RetornoOperacao || "01 - Operação Realizada com Sucesso.",
        data: data.map(normalizeRetorno),
      };
    }

    const { RetornoOperacao, ...dadosParcela } = data;

    const sucesso = RetornoOperacao === "01 - Operação Realizada com Sucesso.";
    return {
      error: !sucesso,
      message: RetornoOperacao,
      data: sucesso ? [dadosParcela] : [],
    };

  } catch (err) {
    const mensagemErro = err.response?.data || err.message || "Resposta inesperada do servidor.";
    return {
      error: true,
      message: `Erro no servidor - ${mensagemErro}`,
      data: [],
    };
  }
}

module.exports = getParcelas; 