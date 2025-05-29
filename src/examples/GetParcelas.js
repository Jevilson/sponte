const getParcelas = require("../endpoints/GetParcelas");

// Exemplo 1: Buscar parcelas pelo código do aluno
getParcelas({
  sToken: "seu_token",
  nCodigoCliente: "seu_codigo_cliente",
  sParametrosBusca: "AlunoID=126"
})
  .then(console.log)
  .catch(console.log);

// Exemplo 2: Buscar parcelas pelo código do plano e número da parcela
getParcelas({
  sToken: "seu_token",
  nCodigoCliente: "seu_codigo_cliente",
  sParametrosBusca: "ContaReceberID=10;NumeroParcela=1"
})
  .then(console.log)
  .catch(console.log);

// Exemplo 3: Buscar parcelas pendentes de um aluno em um período
getParcelas({
  sToken: "seu_token",
  nCodigoCliente: "seu_codigo_cliente",
  sParametrosBusca: "AlunoID=10;Situacao=0;DataVencimento=2025/05/01 e 2025/06/01"
})
  .then(console.log)
  .catch(console.log); 