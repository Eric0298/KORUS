import api from "./api";

export const loginRequest = async (correo, contrasena) => {
  const response = await api.post("/auth/login", { correo, contrasena });
  return response.data; 
};
