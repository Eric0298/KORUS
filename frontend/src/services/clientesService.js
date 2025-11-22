import api from "./api";

export const obtenerClientes = async () => {
  const res = await api.get("/clientes");
  return res.data; 
};

export const crearClienteRequest = async (clienteData) => {
  const res = await api.post("/clientes", clienteData);
  return res.data;
};
export const obtenerClientePorId = async (id) => {
  const res = await api.get(`/clientes/${id}`);
  return res.data; 
};
export const actualizarClienteRequest = async (id, datosActualizados) => {
  const res = await api.put(`/clientes/${id}`, datosActualizados);
  return res.data; 
};
export const eliminarClienteRequest = async (id) => {
  const res = await api.delete(`/clientes/${id}`);
  return res.data; 
};