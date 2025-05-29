const api = require("../api");
const convertToJSON = require("../utils/convertToJSON");
const normalizeRetorno = require("../utils/normalizeRetorno");
const validateParams = require("../utils/validators");


/**
 * Método visa consultar as informações de um ou vários alunos.
 *
 * @async
 * @function getAlunos
 * @param {Object} params - Parâmetros da requisição.
 * @param {string} params.nCodigoCliente - Código do cliente. Obrigatório.
 * @param {string} params.sToken - Token de autenticação. Obrigatório.
 * @param {string} params.sParametrosBusca. Obrigatório. - Parâmetros opcionais de busca no formato: `Nome_Parâmetro=Campo_Busca;Nome_Parâmetro2=Campo_Busca2`.
 *
 * Parâmetros possíveis:
 * - AlunoID (Integer)
 * - CPF (String)
 * - RA (String)
 * - ResponsavelID (Integer)
 * - Nome (String)
 * - Email (String)
 * - Inadimplente (0 ou 1) Recebe 1 (Inadimplentes) ou 0 (Não Inadimplentes) 
 * - SituacaoAlunoID (Integer) Recebe o código da situação do aluno. Obtenha as situações utilizando o método Alunos > getSituacoesAlunos
 * - DataCadastro (Date) Opção 1 – Filtrar apenas pela data sem horário: Ano/Mês/Dia Exemplo: DataCadastro=2017/12/25; Opção 2 – Filtrar por um período de data de cadastro com horário: Ano/Mês/Dia Hora:Minutoe Ano/Mês/Dia Hora:Minuto Exemplo: DataCadastro=2017/01/25 07:10 e 2017/12/25 23:59
 * - NumeroMatricula (String)
 * - OrigemID (Integer)
 * - NomeOrigem (String)
 *
 * @returns {Promise<{ error: boolean, message: string, data: Array }>}
 */

async function getAlunos({ nCodigoCliente, sToken, sParametrosBusca }) {
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
    const response = await api.get("/GetAlunos", {
      params: { nCodigoCliente, sToken, sParametrosBusca },
    });

    const json = convertToJSON(response.data);
    const data = json?.ArrayOfWsAluno?.wsAluno;

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

    const { RetornoOperacao, ...dadosAluno } = data;

    const sucesso = RetornoOperacao === "01 - Operação Realizada com Sucesso.";
    return {
      error: !sucesso,
      message: RetornoOperacao,
      data: sucesso ? [dadosAluno] : [],
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

module.exports =  getAlunos;
