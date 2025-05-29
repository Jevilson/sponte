const getAlunos = require("../endpoints/GetAlunos");

getAlunos({
  sToken: "",
  nCodigoCliente: "",
  sParametrosBusca: ""
})
  .then(console.log)
  .catch(console.log)