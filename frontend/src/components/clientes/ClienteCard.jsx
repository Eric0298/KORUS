import { Link } from "react-router-dom";
import { useState } from "react";
import { eliminarClienteRequest } from "../../services/clientesService";

export default function ClienteCard({ cliente, onEliminado }) {
  const {
    _id,
    nombre,
    apellidos,
    nombreMostrar,
    fotoPerfilUrl,
    objetivoPrincipal,
    nivelGeneral,
    estado,
    experienciaDeportiva = [],
    rutinaActiva,
  } = cliente;

  const [eliminando, setEliminando] = useState(false);

  const nombreCompleto =
    nombreMostrar || [nombre, apellidos].filter(Boolean).join(" ");

  const deportePrincipal = experienciaDeportiva[0]?.deporte;

  const inicial = (nombreCompleto || "C").charAt(0).toUpperCase();

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

  const traducirEstado = (e) => {
    const mapa = {
      activo: "Activo",
      pausado: "Pausado",
      finalizado: "Finalizado",
      archivado: "Archivado",
    };
    return mapa[e] || e;
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
      "¿Seguro que quieres eliminar (archivar) este cliente?"
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarClienteRequest(_id);
      if (onEliminado) onEliminado();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("Error al eliminar el cliente");
    } finally {
      setEliminando(false);
    }
  };

  const estadoClasses =
    estado === "activo"
      ? "bg-korus-success/15 border border-korus-success/40 text-korus-success"
      : estado === "pausado"
      ? "bg-korus-warning/15 border border-korus-warning/40 text-korus-warning"
      : "bg-korus-border/60 border border-korus-border text-korus-textMuted";

  return (
    <div className="bg-korus-card border border-korus-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:border-korus-primary/50 transition">
      {/* Cabecera: avatar + nombre + estado */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {fotoPerfilUrl ? (
            <img
              src={fotoPerfilUrl}
              alt={nombreCompleto}
              className="w-12 h-12 rounded-full object-cover border border-korus-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-korus-primary text-white flex items-center justify-center font-semibold shadow-sm">
              {inicial}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm md:text-base text-slate-100">
              {nombreCompleto || "Cliente sin nombre"}
            </h3>
            {deportePrincipal && (
              <p className="text-xs text-korus-textMuted">
                {deportePrincipal}
              </p>
            )}
          </div>
        </div>

        <span
          className={`text-[11px] px-2 py-1 rounded-full ${estadoClasses}`}
        >
          {traducirEstado(estado)}
        </span>
      </div>

      {/* Objetivos / nivel */}
      <div className="text-xs text-slate-200 space-y-1">
        <p>
          <span className="font-medium text-korus-textMuted">Objetivo:</span>{" "}
          {traducirObjetivo(objetivoPrincipal)}
        </p>
        <p>
          <span className="font-medium text-korus-textMuted">Nivel:</span>{" "}
          {traducirNivel(nivelGeneral)}
        </p>
      </div>

      {/* Rutina actual */}
      <div className="text-xs text-slate-200">
        <span className="font-medium text-korus-textMuted">
          Rutina actual:
        </span>{" "}
        {rutinaActiva ? "Rutina asignada" : "Sin rutina asignada"}
      </div>

      {/* Footer acciones */}
      <div className="mt-1 flex justify-between items-center gap-2">
        <button
          type="button"
          onClick={handleEliminar}
          disabled={eliminando}
          className={`text-xs px-3 py-1 rounded-xl border ${
            eliminando
              ? "border-korus-danger/40 text-korus-danger/40 cursor-not-allowed"
              : "border-korus-danger text-korus-danger hover:bg-korus-danger/10"
          } transition`}
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </button>

        <Link
          to={`/clientes/${cliente._id}`}
          className="text-xs px-3 py-1 rounded-xl border border-korus-border text-slate-200 hover:bg-korus-border/40 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
