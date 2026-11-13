import axios from "axios";

const api = axios.create({
  baseURL: "https://sistema-gerenciamento-academico.onrender.com/api",
  // baseURL: "http://127.0.0.1:8000/api"
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === "token_not_valid") {
      localStorage.removeItem("@token");
      localStorage.removeItem("@refreshToken");
      localStorage.removeItem("@usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Adiciona o token em todas as requisições caso exista no localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const buscarProva = async (quiz_id) => {
  const response = await api.get(`/prova/visualizar/${quiz_id}/`);
  return response.data;
};

export const cadastrarProva = async (payload) => {
  const response = await api.post(`/prova/criar/`, payload);
  return response.data;
};

export const buscarTodasProvas = async () => {
  const response = await api.get("/provas/");
  return response.data;
};

export const submeterProva = async (quiz_id, discente_id, respostas) => {
  const payload = {
    discente_id: discente_id,
    respostas_enviadas: respostas,
  };

  const response = await api.post(`/prova/submeter/${quiz_id}/`, payload);
  return response.data;
};

export const buscarTurmas = async () => {
  const response = await api.get(`/turmas/`);
  return response.data;
};

export default api;