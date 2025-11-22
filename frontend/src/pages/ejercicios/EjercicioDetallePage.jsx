import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  obtenerEjercicioPorId,
  actualizarEjercicioRequest,
  eliminarEjercicioRequest,
} from "../../services/ejerciciosServices";
import EjercicioCard from "../../components/ejercicios/EjercicioCard";

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
        err.response?.data?.mensaje || "Error al guardar los cambios del ejercicio"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarEjercicio = async () => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este ejercicio?");
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
    return <p>Cargando ejercicio...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">{error}</p>
        <Link
          to="/ejercicios"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Volver a ejercicios
        </Link>
      </div>
    );
  }

  if (!ejercicio) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Ejercicio no encontrado.</p>
        <Link
          to="/ejercicios"
          className="inline-block text-sm text-blue-600 hover:underline"
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
        <h1 className="text-2xl font-bold">Ejercicio: {ejercicio.nombre}</h1>
        <Link
          to="/ejercicios"
          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
        >
          ← Volver a ejercicios
        </Link>
      </div>

      {/* Card resumen */}
      <div className="max-w-lg">
        <EjercicioCard ejercicio={ejercicio} />
      </div>

      {/* Bloque de edición */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Editar ejercicio</h2>
          <button
            type="button"
            onClick={handleEliminarEjercicio}
            disabled={eliminando}
            className={`text-xs px-3 py-1 rounded border border-red-200 ${
              eliminando
                ? "bg-red-100 text-red-300 cursor-not-allowed"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            {eliminando ? "Eliminando..." : "Eliminar ejercicio"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-green-600 text-sm">{mensajeExito}</p>
        )}

        <form onSubmit={handleGuardarCambios} className="space-y-3 text-sm">
          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Grupo muscular</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={grupoMuscular}
              onChange={(e) => setGrupoMuscular(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">URL de vídeo</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="https://..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Equipo necesario (coma separadas)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={equipoTexto}
              onChange={(e) => setEquipoTexto(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Etiquetas (coma separadas)</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={etiquetasTexto}
              onChange={(e) => setEtiquetasTexto(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className={`px-4 py-2 rounded text-sm text-white ${
              guardando
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </section>

      {/* Bloques de info (como antes) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Equipo necesario</h2>
        {equipo.length === 0 ? (
          <p className="text-sm text-slate-600">Sin equipo específico.</p>
        ) : (
          <ul className="list-disc ml-4 text-sm text-slate-700">
            {equipo.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Etiquetas</h2>
        {etiquetas.length === 0 ? (
          <p className="text-sm text-slate-600">Sin etiquetas.</p>
        ) : (
          <div className="flex flex-wrap gap-2 text-xs">
            {etiquetas.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Vídeo de referencia</h2>
        {ejercicio.videoUrl ? (
          <a
            href={ejercicio.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Ver vídeo del ejercicio
          </a>
        ) : (
          <p className="text-sm text-slate-600">Sin vídeo asociado.</p>
        )}
      </section>
    </div>
  );
}
