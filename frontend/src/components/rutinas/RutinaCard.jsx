// src/components/rutinas/RutinaCard.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { eliminarRutinaRequest } from "../../services/rutinasService";

export default function RutinaCard({ rutina, onEliminada }) {
  const {
    _id,
    nombre,
    objetivo,
    nivel,
    tipoSplit,
    diasPorSemana,
    semanasTotales,
    estado,
    esPlantilla,
  } = rutina;

  const [eliminando, setEliminando] = useState(false);

  const traducirObjetivo = (obj) => {
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
    return mapa[obj] || obj;
  };

  const traducirNivel = (n) => {
    const mapa = {
      principiante: "Principiante",
      intermedio: "Intermedio",
      avanzado: "Avanzado",
      competicion: "Competición",
      elite: "Élite",
    };
    return mapa[n] || n;
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar (archivar) esta rutina?"
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarRutinaRequest(_id);
      if (onEliminada) onEliminada(); // recarga la lista en la página
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
      alert("Error al eliminar la rutina");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm md:text-base">{nombre}</h3>
          <p className="text-xs text-slate-500">
            {traducirObjetivo(objetivo)} · {traducirNivel(nivel)}
          </p>
        </div>

        {esPlantilla && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            Plantilla
          </span>
        )}
      </div>

      {/* Datos básicos */}
      <div className="text-xs text-slate-600 space-y-1">
        <p>
          <span className="font-medium">Tipo split:</span>{" "}
          {tipoSplit || "-"}
        </p>
        <p>
          <span className="font-medium">Días/semana:</span>{" "}
          {diasPorSemana || "-"}
        </p>
        <p>
          <span className="font-medium">Semanas totales:</span>{" "}
          {semanasTotales || "-"}
        </p>
      </div>

      {/* Estado + acciones */}
      <div className="flex items-center justify-between mt-1 gap-2">
        <span
          className={`text-[10px] px-2 py-1 rounded-full ${
            estado === "activa"
              ? "bg-emerald-100 text-emerald-700"
              : estado === "borrador"
              ? "bg-amber-100 text-amber-700"
              : estado === "plantilla"
              ? "bg-sky-100 text-sky-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {estado}
        </span>

        <div className="flex gap-2">
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
            to={`/rutinas/${_id}`}
            className="text-xs px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
