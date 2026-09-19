import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const buscarProva = async (quiz_id) => {
  const response = await api.get(`/prova/visualizar/${quiz_id}/`);

  return response.data;
};

export const cadastrarProva = async (payload) => {
  const response = await api.post(`/prova/criar/`, payload);

  return response.data;
};

export const buscarProvas = async (class_id) => {
  const response = await api.get(`/provas/${class_id}/`);

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
  },
);

export default api;
