const getAlunos = require("../endpoints/GetAlunos");

getAlunos({
  sToken: "seu_token",
  nCodigoCliente: "seu_codigo_cliente",
  sParametrosBusca: ""
})
  .then(console.log)
  .catch(console.log)