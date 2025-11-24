import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  obtenerRutinaPorId,
  actualizarRutinaRequest,
  eliminarRutinaRequest,
} from "../../services/rutinasService";

export default function RutinaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rutina, setRutina] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("borrador");
  const [tipoSplit, setTipoSplit] = useState("");
  const [diasPorSemana, setDiasPorSemana] = useState("");
  const [semanasTotales, setSemanasTotales] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await obtenerRutinaPorId(id);
        const r = data.rutina;
        setRutina(r);

        setNombre(r.nombre || "");
        setDescripcion(r.descripcion || "");
        setEstado(r.estado || "borrador");
        setTipoSplit(r.tipoSplit || "");
        setDiasPorSemana(r.diasPorSemana ?? "");
        setSemanasTotales(r.semanasTotales ?? "");
      } catch (err) {
        console.error(err);
        setError("Error al cargar la rutina");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        nombre: nombre.trim(),
        descripcion,
        estado,
        tipoSplit,
        diasPorSemana: diasPorSemana ? Number(diasPorSemana) : undefined,
        semanasTotales: semanasTotales ? Number(semanasTotales) : undefined,
      };

      const data = await actualizarRutinaRequest(id, payload);
      setRutina(data.rutina);
      setMensajeExito("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje ||
          "Error al guardar los cambios de la rutina"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarRutina = async () => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar esta rutina?");
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarRutinaRequest(id);
      navigate("/rutinas");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la rutina");
      setEliminando(false);
    }
  };

  if (cargando) {
    return <p className="text-sm text-korus-textMuted">Cargando rutina...</p>;
  }

  if (error && !rutina) {
    return (
      <div className="space-y-4">
        <p className="text-korus-danger text-sm">{error}</p>
        <Link
          to="/rutinas"
          className="inline-block text-sm text-korus-accent hover:underline"
        >
          ← Volver a rutinas
        </Link>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-korus-textMuted">Rutina no encontrada.</p>
        <Link
          to="/rutinas"
          className="inline-block text-sm text-korus-accent hover:underline"
        >
          ← Volver a rutinas
        </Link>
      </div>
    );
  }

  const dias = rutina.dias || [];

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-korus-text">
          Rutina: {rutina.nombre}
        </h1>
        <Link
          to="/rutinas"
          className="text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-textMuted hover:bg-korus-card/80 transition"
        >
          ← Volver a rutinas
        </Link>
      </div>

      {/* BLOQUE EDICIÓN (con borde liso, sin degradado para no abusar) */}
      <section className="bg-korus-card rounded-2xl border border-korus-border shadow p-4 space-y-3 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-korus-text">
            Editar rutina
          </h2>
          <button
            type="button"
            onClick={handleEliminarRutina}
            disabled={eliminando}
            className={`text-xs px-3 py-1 rounded-xl border ${
              eliminando
                ? "border-korus-danger/30 bg-korus-danger/10 text-korus-danger/50 cursor-not-allowed"
                : "border-korus-danger/40 text-korus-danger hover:bg-korus-danger/10"
            }`}
          >
            {eliminando ? "Eliminando..." : "Eliminar rutina"}
          </button>
        </div>

        {error && <p className="text-korus-danger text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-korus-success text-sm">{mensajeExito}</p>
        )}

        <form onSubmit={handleGuardarCambios} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-korus-textMuted mb-1">
              NOMBRE
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
              placeholder:text-korus-textMuted/70
              focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-korus-textMuted mb-1">
              DESCRIPCIÓN
            </label>
            <textarea
              className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
              placeholder:text-korus-textMuted/70
              focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                ESTADO
              </label>
              <select
                className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60 cursor-pointer"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="borrador">Borrador</option>
                <option value="activa">Activa</option>
                <option value="plantilla">Plantilla</option>
                <option value="archivada">Archivada</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                DÍAS POR SEMANA
              </label>
              <input
                type="number"
                min="1"
                max="14"
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
                min="1"
                max="52"
                className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                value={semanasTotales}
                onChange={(e) => setSemanasTotales(e.target.value)}
              />
            </div>
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
              placeholder="fullbody, torso-pierna, empuje-tirón-pierna..."
              value={tipoSplit}
              onChange={(e) => setTipoSplit(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className={`
              px-4 py-2 rounded-xl text-sm font-semibold text-white shadow
              ${
                guardando
                  ? "bg-korus-primary/40 cursor-not-allowed"
                  : "bg-korus-primary hover:bg-korus-primary/90 hover:shadow-lg"
              }
            `}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </section>

      {/* ESTRUCTURA DE LA RUTINA */}
      <section className="bg-korus-card rounded-2xl border border-korus-border shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg text-korus-text mb-1">
          Días y ejercicios
        </h2>

        {dias.length === 0 ? (
          <p className="text-sm text-korus-textMuted">
            Esta rutina todavía no tiene días ni ejercicios configurados.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-slate-200">
            {dias.map((dia, idxDia) => (
              <div
                key={idxDia}
                className="border border-korus-border/70 rounded-xl p-3 bg-korus-bg/60"
              >
                <p className="font-semibold mb-1 text-korus-text">
                  {dia.nombreDia || `Día ${idxDia + 1}`}{" "}
                  {dia.orden && (
                    <span className="text-korus-textMuted">· #{dia.orden}</span>
                  )}
                </p>

                {dia.ejercicios && dia.ejercicios.length > 0 ? (
                  <ul className="list-disc ml-4 space-y-1 text-xs md:text-sm">
                    {dia.ejercicios.map((ej, idxEj) => (
                      <li key={idxEj}>
                        <span className="font-medium">{ej.nombreEjercicio}</span>
                        {ej.grupoMuscular && (
                          <span className="text-korus-textMuted">
                            {" "}
                            · {ej.grupoMuscular}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-korus-textMuted">
                    Sin ejercicios definidos en este día.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
