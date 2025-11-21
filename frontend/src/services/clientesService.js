import api from "./api";

export const obtenerClientes = async () => {
  const res = await api.get("/clientes");
  return res.data; 
};

export const crearClienteRequest = async (clienteData) => {
  const res = await api.post("/clientes", clienteData);
  return res.data;
};
