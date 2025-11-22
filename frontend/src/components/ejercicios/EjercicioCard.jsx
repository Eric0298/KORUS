import { Link } from "react-router-dom";
import { useState } from "react";
import { eliminarEjercicioRequest } from "../../services/ejerciciosServices";

export default function EjercicioCard({ ejercicio, onEliminado }) {
  const { _id, nombre, grupoMuscular, etiquetas = [] } = ejercicio;
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async () => {
    const ok = window.confirm("¿Eliminar este ejercicio?");
    if (!ok) return;

    try {
      setEliminando(true);
      await eliminarEjercicioRequest(_id);
      if (onEliminado) onEliminado();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar ejercicio");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-semibold text-sm md:text-base">{nombre}</h3>
        <p className="text-xs text-slate-500">
          {grupoMuscular || "Grupo muscular no definido"}
        </p>
      </div>

      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 text-[10px]">
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

      <div className="mt-1 flex justify-between items-center gap-2">
        <button
          type="button"
          onClick={handleEliminar}
          disabled={eliminando}
          className={`text-xs px-3 py-1 rounded border border-red-200 ${
            eliminando
              ? "bg-red-100 text-red-300 cursor-not-allowed"
              : "text-red-700 hover:bg-red-50"
          }`}
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </button>

        <Link
          to={`/ejercicios/${_id}`}
          className="text-xs px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
