import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { setAuthToken } from "../services/api";

export const AuthProvider = ({ children }) => {
  // Cargar token del almacenamiento local
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [entrenador, setEntrenador] = useState(null);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (jwt, entrenadorInfo) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setEntrenador(entrenadorInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEntrenador(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, entrenador }}>
      {children}
    </AuthContext.Provider>
  );
};
