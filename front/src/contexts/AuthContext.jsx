import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("@token") || "",
  );
  
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("@usuario");
    try {
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("@token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("@token");
      localStorage.removeItem("@usuario");
    }

    setCarregando(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login/", { email, password });
    const { access, usuario: dadosUsuario } = response.data;

    const userFormatado = {
      id: dadosUsuario.id,
      nome: dadosUsuario.nome,
      role: dadosUsuario.role,
      matricula: dadosUsuario.matricula,
    };

    setToken(access);
    setUsuario(userFormatado);
    localStorage.setItem("@usuario", JSON.stringify(userFormatado));

    return access;
  };

  const logout = () => {
    setToken("");
    setUsuario(null);
    localStorage.removeItem("@token");
    localStorage.removeItem("@usuario");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        logout,
        estaAutenticado: !!token,
        carregando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);