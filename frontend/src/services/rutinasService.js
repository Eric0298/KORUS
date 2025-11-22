import api from "./api";
export const obtenerRutinas = async (filtros = {})=>{
    const res = await api.get("/rutinas", {params: filtros});
    return res.data;
};
export const crearRutinaRequest = async (rutinaData)=>{
    const res = await api.post("/rutinas", rutinaData);
    return res.data;
}