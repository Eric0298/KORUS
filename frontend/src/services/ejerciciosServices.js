import api from "./api";
export const obtenerEjercicios = async()=>{
    const res= await api.get("/ejercicios");
    return res.data;
};
export const crearEjercicioRequest = async(ejercicioData)=>{
    const res = await api.post("/ejercicios", ejercicioData);
    return res.data;
};
export const obtenerEjercicioPorId = async (id) => {
  const res = await api.get(`/ejercicios/${id}`);
  return res.data; 
};
export const actualizarEjercicioRequest = async (id, datos) => {
  const res = await api.put(`/ejercicios/${id}`, datos);
  return res.data;
};
export const eliminarEjercicioRequest = async (id) => {
  const res = await api.delete(`/ejercicios/${id}`);
  return res.data;
};