import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.sponteeducacional.net.br/WSAPIEdu.asmx',
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});

export default api;
