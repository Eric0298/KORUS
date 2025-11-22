import api from "./api";
export const obtenerRutinas = async (filtros = {})=>{
    const res = await api.get("/rutinas", {params: filtros});
    return res.data;
};
export const crearRutinaRequest = async (rutinaData)=>{
    const res = await api.post("/rutinas", rutinaData);
    return res.data;
}
export const obtenerRutinaPorId = async (id) => {
  const res = await api.get(`/rutinas/${id}`);
  return res.data; 
};
export const actualizarRutinaRequest = async (id, datos) => {
  const res = await api.put(`/rutinas/${id}`, datos);
  return res.data;
};
export const eliminarRutinaRequest = async (id) => {
  const res = await api.delete(`/rutinas/${id}`);
  return res.data;
};