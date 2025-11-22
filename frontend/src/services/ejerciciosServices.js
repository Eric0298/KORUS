import api from "./api";
export const obtenerEjercicios = async()=>{
    const res= await api.get("/ejercicios");
    return res.data;
};
export const crearEjerciciosRequest = async(ejercicioData)=>{
    const res = await api.post("/ejercicios", ejercicioData);
    return res.data;
};