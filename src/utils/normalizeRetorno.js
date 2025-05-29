const normalizeRetorno = (state) => {
  const { RetornoOperacao, ...dados } = state;
  return dados;
};

export default normalizeRetorno