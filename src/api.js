const { default: axios } = require("axios");

const api = axios.create({
  baseURL: 'https://api.sponteeducacional.net.br/WSAPIEdu.asmx',
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});

module.exports =  api;
