import { useEffect, useState } from "react";
import RutinaCard from "../../components/rutinas/RutinaCard";
import {
  obtenerRutinas,
  crearRutinaRequest,
} from "../../services/rutinasService";

export default function RutinasPage() {
  const [rutinas, setRutinas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoCrear, setCargandoCrear] = useState(false);

  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("ganancia_muscular");
  const [nivel, setNivel] = useState("principiante");
  const [tipoSplit, setTipoSplit] = useState("fullbody");
  const [diasPorSemana, setDiasPorSemana] = useState(3);
  const [semanasTotales, setSemanasTotales] = useState(4);
  const [esPlantilla, setEsPlantilla] = useState(true);

  const cargarRutinas = async () => {
    try {
      setCargando(true);
      const data = await obtenerRutinas();
      setRutinas(data.rutinas || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar rutinas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  const handleCrearRutina = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");
    setCargandoCrear(true);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      setCargandoCrear(false);
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
        dias: [],
      });

      // reset formulario
      setNombre("");
      setObjetivo("ganancia_muscular");
      setNivel("principiante");
      setTipoSplit("fullbody");
      setDiasPorSemana(3);
      setSemanasTotales(4);
      setEsPlantilla(true);

      setMensajeExito("Rutina creada correctamente ✅");
      await cargarRutinas();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Error al crear rutina");
    } finally {
      setCargandoCrear(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Rutinas</h1>

      {/* Formulario creación rápida */}
      <form
        onSubmit={handleCrearRutina}
        className="bg-white p-4 rounded-lg shadow space-y-4 max-w-2xl"
      >
        <h2 className="font-semibold text-lg">Nueva rutina básica</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-green-600 text-sm">{mensajeExito}</p>
        )}

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

        <button
          disabled={cargandoCrear}
          className={`px-4 py-2 rounded text-sm text-white ${
            cargandoCrear
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cargandoCrear ? "Creando..." : "Crear rutina"}
        </button>
      </form>

      {/* Listado de rutinas en cards */}
      <div className="bg-transparent">
        <h2 className="font-semibold text-lg mb-3">Listado de rutinas</h2>

        {cargando ? (
          <p>Cargando rutinas...</p>
        ) : rutinas.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay rutinas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rutinas.map((r) => (
              <RutinaCard
                key={r._id}
                rutina={r}
                onEliminada={cargarRutinas} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
