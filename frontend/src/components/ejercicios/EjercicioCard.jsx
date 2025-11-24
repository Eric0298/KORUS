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
    <div className="bg-korus-card rounded-2xl border border-korus-border shadow-md p-4 flex flex-col gap-3">
      {/* Cabecera:  nombre */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
        
          <div>
            <h3 className="font-semibold text-sm md:text-base text-korus-text">
              {nombre}
            </h3>
            <p className="text-[11px] text-korus-textMuted">
              {grupoMuscular || "Grupo muscular no definido"}
            </p>
          </div>
        </div>
      </div>

      {/* Etiquetas */}
      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-[10px]">
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

      {/* Acciones */}
      <div className="mt-1 flex justify-between items-center gap-2">
        <button
          type="button"
          onClick={handleEliminar}
          disabled={eliminando}
          className={`text-[11px] px-3 py-1 rounded-xl border transition ${
            eliminando
              ? "border-korus-danger/40 bg-korus-danger/10 text-korus-danger/60 cursor-not-allowed"
              : "border-korus-danger/40 text-korus-danger hover:bg-korus-danger/10"
          }`}
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </button>

        <Link
          to={`/ejercicios/${_id}`}
          className="text-[11px] px-3 py-1 rounded-xl border border-korus-border text-korus-text hover:bg-korus-card/80 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
