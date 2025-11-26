import { useEffect, useState } from "react";
import RutinaCard from "../../components/rutinas/RutinaCard";
import {
  obtenerRutinas,
  crearRutinaRequest,
} from "../../services/rutinasService";
import { GradientCard } from "../../components/common/GradientCard";

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
      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold text-korus-text">Rutinas</h1>
        <p className="text-sm text-korus-textMuted mt-1">
          Crea plantillas y rutinas activas para tus clientes.
        </p>
      </div>

      {/* Tarjeta creación rápida (con GradientCard) */}
      <div className="max-w-3xl">
        <GradientCard>
          <form onSubmit={handleCrearRutina} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-lg text-korus-text">
                Nueva rutina básica
              </h2>
              {esPlantilla && (
                <span className="text-[11px] px-2 py-1 rounded-full bg-korus-accent/15 text-korus-accent">
                  Guardando como plantilla
                </span>
              )}
            </div>

            {error && (
              <p className="text-sm text-korus-danger bg-korus-danger/10 border border-korus-danger/40 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {mensajeExito && (
              <p className="text-sm text-korus-success bg-korus-success/10 border border-korus-success/40 px-3 py-2 rounded-lg">
                {mensajeExito}
              </p>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                NOMBRE DE LA RUTINA
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                           placeholder:text-korus-textMuted/70
                           focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Fullbody fuerza 3 días, Torso-Pierna, etc."
              />
            </div>

            {/* Primera fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  OBJETIVO
                </label>
                <select
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60 cursor-pointer"
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
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  NIVEL
                </label>
                <select
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60 cursor-pointer"
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
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  TIPO DE SPLIT
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             placeholder:text-korus-textMuted/70
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                  value={tipoSplit}
                  onChange={(e) => setTipoSplit(e.target.value)}
                  placeholder="fullbody, torso-pierna, weider..."
                />
              </div>
            </div>

            {/* Segunda fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  DÍAS POR SEMANA
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                  value={diasPorSemana}
                  onChange={(e) => setDiasPorSemana(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  SEMANAS TOTALES
                </label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                  value={semanasTotales}
                  onChange={(e) => setSemanasTotales(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  id="esPlantilla"
                  type="checkbox"
                  className="rounded border-korus-border text-korus-accent focus:ring-korus-accent/60"
                  checked={esPlantilla}
                  onChange={(e) => setEsPlantilla(e.target.checked)}
                />
                <label
                  htmlFor="esPlantilla"
                  className="text-xs text-korus-textMuted"
                >
                  Guardar como plantilla
                </label>
              </div>
            </div>

            <button
              disabled={cargandoCrear}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-korus-primary via-korus-accent to-orange-400
                shadow-md shadow-korus-primary/30
                transition
                ${
                  cargandoCrear
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:brightness-110"
                }`}
            >
              {cargandoCrear ? "Creando..." : "Crear rutina"}
            </button>
          </form>
        </GradientCard>
      </div>

      {/* LISTADO DE RUTINAS */}
      <div className="bg-transparent">
        <h2 className="font-semibold text-lg mb-3 text-korus-text">
          Listado de rutinas
        </h2>

        {cargando ? (
          <p className="text-sm text-korus-textMuted">Cargando rutinas...</p>
        ) : rutinas.length === 0 ? (
          <p className="text-sm text-korus-textMuted">Aún no hay rutinas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rutinas.map((r) => (
              <RutinaCard key={r._id} rutina={r} onEliminada={cargarRutinas} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
