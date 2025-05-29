import getAlunos from "../endpoints/GetAlunos.js";

getAlunos({
  sToken: "",
  nCodigoCliente: "",
  sParametrosBusca: ""
})
  .then(console.log)
  .catch(console.log)