import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  obtenerEjercicioPorId,
  actualizarEjercicioRequest,
  eliminarEjercicioRequest,
} from "../../services/ejerciciosServices";

export default function EjercicioDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ejercicio, setEjercicio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados de edición
  const [nombre, setNombre] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [equipoTexto, setEquipoTexto] = useState("");
  const [etiquetasTexto, setEtiquetasTexto] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await obtenerEjercicioPorId(id);
        const ej = data.ejercicio;
        setEjercicio(ej);

        setNombre(ej.nombre || "");
        setGrupoMuscular(ej.grupoMuscular || "");
        setDescripcion(ej.descripcion || "");
        setVideoUrl(ej.videoUrl || "");
        setEquipoTexto((ej.equipoNecesario || []).join(", "));
        setEtiquetasTexto((ej.etiquetas || []).join(", "));
      } catch (err) {
        console.error(err);
        setError("Error al cargar el ejercicio");
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

      const equipoNecesario = equipoTexto
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const etiquetas = etiquetasTexto
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        nombre: nombre.trim(),
        grupoMuscular: grupoMuscular.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        equipoNecesario,
        etiquetas,
      };

      const data = await actualizarEjercicioRequest(id, payload);
      setEjercicio(data.ejercicio);
      setMensajeExito("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje ||
          "Error al guardar los cambios del ejercicio"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarEjercicio = async () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este ejercicio?"
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarEjercicioRequest(id);
      navigate("/ejercicios");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el ejercicio");
      setEliminando(false);
    }
  };

  if (cargando) {
    return <p className="text-sm text-korus-textMuted">Cargando ejercicio...</p>;
  }

  if (error && !ejercicio) {
    return (
      <div className="space-y-4">
        <p className="text-korus-danger text-sm">{error}</p>
        <Link
          to="/ejercicios"
          className="inline-block text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-text hover:bg-korus-card/80"
        >
          ← Volver a ejercicios
        </Link>
      </div>
    );
  }

  if (!ejercicio) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-korus-textMuted">Ejercicio no encontrado.</p>
        <Link
          to="/ejercicios"
          className="inline-block text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-text hover:bg-korus-card/80"
        >
          ← Volver a ejercicios
        </Link>
      </div>
    );
  }

  const equipo = ejercicio.equipoNecesario || [];
  const etiquetas = ejercicio.etiquetas || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-korus-text">
            Ejercicio: {ejercicio.nombre}
          </h1>
          {ejercicio.grupoMuscular && (
            <p className="text-sm text-korus-textMuted mt-1">
              Grupo muscular: {ejercicio.grupoMuscular}
            </p>
          )}
        </div>
        <Link
          to="/ejercicios"
          className="text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-text hover:bg-korus-card/80"
        >
          ← Volver a ejercicios
        </Link>
      </div>

      {/* Bloque de edición (lado izquierdo) + vídeo (derecha en desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Edición */}
        <div className="bg-korus-card rounded-2xl border border-korus-border shadow-xl p-4 space-y-3 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-korus-primary via-korus-accent to-orange-400" />

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-korus-text">
              Editar ejercicio
            </h2>
            <button
              type="button"
              onClick={handleEliminarEjercicio}
              disabled={eliminando}
              className={`text-[11px] px-3 py-1 rounded-xl border transition ${
                eliminando
                  ? "border-korus-danger/40 bg-korus-danger/10 text-korus-danger/60 cursor-not-allowed"
                  : "border-korus-danger/40 text-korus-danger hover:bg-korus-danger/10"
              }`}
            >
              {eliminando ? "Eliminando..." : "Eliminar ejercicio"}
            </button>
          </div>

          {error && (
            <p className="text-korus-danger text-xs bg-korus-danger/10 border border-korus-danger/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {mensajeExito && (
            <p className="text-emerald-300 text-xs bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              {mensajeExito}
            </p>
          )}

          <form onSubmit={handleGuardarCambios} className="space-y-3 text-sm">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                Nombre
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                Grupo muscular
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                value={grupoMuscular}
                onChange={(e) => setGrupoMuscular(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                Descripción
              </label>
              <textarea
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                URL de vídeo
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           placeholder:text-korus-textMuted/70
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                placeholder="https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                Equipo necesario (separado por comas)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                value={equipoTexto}
                onChange={(e) => setEquipoTexto(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-korus-textMuted uppercase tracking-wide">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg/40 text-korus-text text-sm px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-korus-primary/60 focus:border-korus-primary/60"
                value={etiquetasTexto}
                onChange={(e) => setEtiquetasTexto(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-korus-primary via-korus-accent to-orange-400
                shadow-md shadow-korus-primary/30
                transition
                ${
                  guardando
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:brightness-110"
                }`}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        {/* Panel lateral: vídeo + chips */}
        <div className="space-y-4">
          <section className="bg-korus-card rounded-2xl border border-korus-border shadow p-4 space-y-2">
            <h2 className="font-semibold text-sm text-korus-text mb-1">
              Vídeo de referencia
            </h2>
            {ejercicio.videoUrl ? (
              <a
                href={ejercicio.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-korus-primary hover:text-korus-accent"
              >
                Ver vídeo del ejercicio
              </a>
            ) : (
              <p className="text-xs text-korus-textMuted">
                Sin vídeo asociado todavía.
              </p>
            )}
          </section>

          <section className="bg-korus-card rounded-2xl border border-korus-border shadow p-4 space-y-2">
            <h2 className="font-semibold text-sm text-korus-text">
              Equipo necesario
            </h2>
            {equipo.length === 0 ? (
              <p className="text-xs text-korus-textMuted">
                Sin equipo específico.
              </p>
            ) : (
              <ul className="list-disc ml-4 text-xs text-korus-textMuted">
                {equipo.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-korus-card rounded-2xl border border-korus-border shadow p-4 space-y-2">
            <h2 className="font-semibold text-sm text-korus-text">Etiquetas</h2>
            {etiquetas.length === 0 ? (
              <p className="text-xs text-korus-textMuted">Sin etiquetas.</p>
            ) : (
              <div className="flex flex-wrap gap-2 text-[11px]">
                {etiquetas.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-full bg-korus-primarySoft text-korus-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
