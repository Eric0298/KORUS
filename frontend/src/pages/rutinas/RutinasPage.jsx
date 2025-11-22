import { useEffect, useState } from "react";
import {
    obtenerRutinas,
    crearRutinaRequest,
}from "../../services/rutinasService";
export default function RutinasPage(){
   const [rutinas, setRutinas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("ganancia_muscular");
  const [nivel, setNivel] = useState("principiante");
  const [tipoSplit, setTipoSplit] = useState("fullbody");
  const [diasPorSemana, setDiasPorSemana] = useState(3);
  const [semanasTotales, setSemanasTotales] = useState(4);
  const [esPlantilla, setEsPlantilla] = useState(true);
  const cargarRutinas = async ()=>{
    try{
        setCargando(true);
        const data = await obtenerRutinas();
        setRutinas(data.rutinas||[]);
    }catch(err){
        console.error(err);
        setError("Error al cargar rutnas");
    }finally{
        setCargando(false);
    }
  };
  useEffect(()=>{
    cargarRutinas();
  },[]);
  const handleCrearRutina = async(e)=>{
    e.preventDefault();
    setError("");

    if(!nombre.trim()){
        setError("El nombre es obligatorio");
        return;
    }
    try {
         await crearRutinaRequest({
        nombre,
        objetivo,
        nivel,
        tipoSplit,
        diasPorSemana: Number(diasPorSemana),
        semanasTotales: Number(semanasTotales),
        esPlantilla,
        dias: [], // de momento, sin días ni ejercicios
      });
       setNombre("");
      setObjetivo("ganancia_muscular");
      setNivel("principiante");
      setTipoSplit("fullbody");
      setDiasPorSemana(3);
      setSemanasTotales(4);
      setEsPlantilla(true);
      await cargarRutinas();
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.mensaje|| "Error al crear rutina");
    }
  };
  const traducirObjetivo = (obj)=>{
    const mapa = {
        perdida_grasa: "Pérdida de grasa",
      ganancia_muscular: "Ganancia muscular",
      rendimiento: "Rendimiento",
      salud_general: "Salud general",
      rehabilitacion: "Rehabilitación",
      competicion: "Competición",
      mantenimiento: "Mantenimiento",
      otro: "Otro",
    };
    return mapa[obj]||obj;
  };
  return(
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rutinas</h1>

      {/* Formulario creación rápida */}
      <form
        onSubmit={handleCrearRutina}
        className="bg-white p-4 rounded-lg shadow space-y-4 max-w-2xl"
      >
        <h2 className="font-semibold text-lg">Nueva rutina básica</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Nombre de la rutina</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Objetivo</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            >
              <option value="perdida_grasa">Pérdida de grasa</option>
              <option value="ganancia_muscular">Ganancia muscular</option>
              <option value="rendimiento">Rendimiento</option>
              <option value="salud_general">Salud general</option>
              <option value="rehabilitacion">Rehabilitación</option>
              <option value="competicion">Competición</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="competicion">Competición</option>
              <option value="elite">Élite</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Tipo de split</label>
            <input
              type="text"
              className="w-full border rounded p-2 text-sm"
              value={tipoSplit}
              onChange={(e) => setTipoSplit(e.target.value)}
              placeholder="fullbody, torso-pierna, weider..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Días por semana</label>
            <input
              type="number"
              className="w-full border rounded p-2 text-sm"
              min={1}
              max={14}
              value={diasPorSemana}
              onChange={(e) => setDiasPorSemana(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Semanas totales</label>
            <input
              type="number"
              className="w-full border rounded p-2 text-sm"
              min={1}
              max={52}
              value={semanasTotales}
              onChange={(e) => setSemanasTotales(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              id="esPlantilla"
              type="checkbox"
              checked={esPlantilla}
              onChange={(e) => setEsPlantilla(e.target.checked)}
            />
            <label htmlFor="esPlantilla" className="text-sm">
              Guardar como plantilla
            </label>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Crear rutina
        </button>
      </form>

      {/* Listado de rutinas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3">Listado de rutinas</h2>

        {cargando ? (
          <p>Cargando rutinas...</p>
        ) : rutinas.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay rutinas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Nombre</th>
                <th className="py-2">Objetivo</th>
                <th className="py-2">Nivel</th>
                <th className="py-2">Tipo split</th>
                <th className="py-2">Días/sem</th>
                <th className="py-2">Semanas</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Plantilla</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="py-2">{r.nombre}</td>
                  <td className="py-2">{traducirObjetivo(r.objetivo)}</td>
                  <td className="py-2">{r.nivel}</td>
                  <td className="py-2">{r.tipoSplit || "-"}</td>
                  <td className="py-2">{r.diasPorSemana || "-"}</td>
                  <td className="py-2">{r.semanasTotales || "-"}</td>
                  <td className="py-2">{r.estado}</td>
                  <td className="py-2">{r.esPlantilla ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

