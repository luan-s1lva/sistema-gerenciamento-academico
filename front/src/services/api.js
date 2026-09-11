import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const buscarProva = async (quiz_id) => {
  const response = await api.get(`/prova/visualizar/${quiz_id}/`);

  return response.data;
};

export const submeterProva = async (quiz_id, discente_id, respostas) => {
  const payload = {
    discente_id: discente_id,
    respostas_enviadas: respostas,
  };

  const response = await api.post(`/prova/submeter/${quiz_id}/`, payload);
};

export default api;
