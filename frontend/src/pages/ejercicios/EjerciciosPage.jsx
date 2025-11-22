import { useEffect,useState } from "react";
import{
    obtenerEjercicios,
    crearEjerciciosRequest,
}from "../../services/ejerciciosServices";
export default function EjerciciosPage(){
    const [ejercicios, setEjercicios] = useState([]);
    const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

   const [nombre, setNombre] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [equipo, setEquipo] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  
  const cargarEjercicios = async()=>{
    try{
      setCargando(true);
      const data = await obtenerEjercicios();
      setEjercicios(data.ejercicios||[]);  
    }catch(err){
        console.error(err);
        setError("Error al cargar ejercicios");
    }finally{
        setCargando(false);
    }
  };
  useEffect(()=>{
    cargarEjercicios();
  },[]);
  const handleCrearEjercicio = async(e)=>{
    e.preventDefault();
    setError("");
    if(!nombre.trim()){
        setError("El nombre del ejercicio es obligatorio");
        return;
    }
    try {
        await crearEjerciciosRequest({
        nombre,
        grupoMuscular,
        descripcion,
        videoUrl,
        equipoNecesario: equipo
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e !== ""),
        etiquetas: etiquetas
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e !== ""),    
        });
        setNombre("");
      setGrupoMuscular("");
      setDescripcion("");
      setVideoUrl("");
      setEquipo("");
      setEtiquetas("");
      await cargarEjercicios();
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.mensaje|| "Error al crear ejercicio");
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ejercicios</h1>

      {/* Formulario creación */}
      <form
        onSubmit={handleCrearEjercicio}
        className="bg-white p-4 rounded-lg shadow space-y-4 max-w-2xl"
      >
        <h2 className="font-semibold text-lg">Nuevo ejercicio</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Sentadilla con mancuernas"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Grupo muscular</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={grupoMuscular}
            onChange={(e) => setGrupoMuscular(e.target.value)}
            placeholder="Piernas, pecho, espalda..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            className="w-full border rounded p-2 text-sm"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles sobre la técnica, rango de movimiento..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">URL de video (opcional)</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/... "
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Equipo necesario (coma)</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            placeholder="mancuernas, banco..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Etiquetas (coma)</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={etiquetas}
            onChange={(e) => setEtiquetas(e.target.value)}
            placeholder="fuerza, hipertrofia ..."
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Crear ejercicio
        </button>
      </form>

      {/* Listado */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3">Listado de ejercicios</h2>

        {cargando ? (
          <p>Cargando ejercicios...</p>
        ) : ejercicios.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay ejercicios.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Nombre</th>
                <th className="py-2">Grupo muscular</th>
                <th className="py-2">Etiquetas</th>
              </tr>
            </thead>
            <tbody>
              {ejercicios.map((ej) => (
                <tr key={ej._id} className="border-b last:border-0">
                  <td className="py-2">{ej.nombre}</td>
                  <td className="py-2">{ej.grupoMuscular || "-"}</td>
                  <td className="py-2">{(ej.etiquetas || []).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}