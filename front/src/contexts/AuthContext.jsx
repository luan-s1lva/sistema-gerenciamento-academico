import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("@token") || "",
  );
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("@token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("@token");
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login/", { email, password });
    const { access } = response.data;
    setToken(access);

    return access;
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, login, logout, estaAutenticado: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
