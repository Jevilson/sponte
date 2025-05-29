const normalizeRetorno = (state) => {
  const { RetornoOperacao, ...dados } = state;
  return dados;
};

module.exports =  normalizeRetorno