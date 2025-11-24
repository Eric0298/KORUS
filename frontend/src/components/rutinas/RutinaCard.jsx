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

  const traducirEstado = (e) => {
    const mapa = {
      borrador: "Borrador",
      activa: "Activa",
      plantilla: "Plantilla",
      archivada: "Archivada",
      completada: "Completada",
    };
    return mapa[e] || e;
  };

  const classesChipEstado = (() => {
    switch (estado) {
      case "activa":
        return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
      case "borrador":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/40";
      case "plantilla":
        return "bg-sky-500/10 text-sky-300 border border-sky-500/40";
      case "completada":
        return "bg-korus-accent/10 text-korus-accent border border-korus-accent/40";
      case "archivada":
      default:
        return "bg-korus-border/20 text-korus-textMuted border border-korus-border/60";
    }
  })();

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar (archivar) esta rutina?"
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarRutinaRequest(_id);
      if (onEliminada) onEliminada();
    } catch (error) {
      console.error("Error al eliminar rutina:", error);
      alert("Error al eliminar la rutina");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="bg-korus-card rounded-2xl border border-korus-border shadow-md p-4 flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm md:text-base text-korus-text">
            {nombre}
          </h3>
          <p className="text-[11px] text-korus-textMuted mt-0.5">
            {traducirObjetivo(objetivo)} · {traducirNivel(nivel)}
          </p>
        </div>

        {esPlantilla && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-korus-accent/10 text-korus-accent border border-korus-accent/40">
            Plantilla
          </span>
        )}
      </div>

      {/* Datos básicos */}
      <div className="text-[11px] text-korus-textMuted space-y-1">
        <p>
          <span className="font-medium text-korus-text">Tipo split:</span>{" "}
          {tipoSplit || "-"}
        </p>
        <p>
          <span className="font-medium text-korus-text">Días/semana:</span>{" "}
          {diasPorSemana || "-"}
        </p>
        <p>
          <span className="font-medium text-korus-text">Semanas totales:</span>{" "}
          {semanasTotales || "-"}
        </p>
      </div>

      {/* Estado + acciones */}
      <div className="flex items-center justify-between mt-1 gap-2">
        <span
          className={`text-[10px] px-2 py-1 rounded-full ${classesChipEstado}`}
        >
          {traducirEstado(estado)}
        </span>

        <div className="flex gap-2">
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
            to={`/rutinas/${_id}`}
            className="text-[11px] px-3 py-1 rounded-xl border border-korus-border text-korus-text hover:bg-korus-card/80 transition"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
