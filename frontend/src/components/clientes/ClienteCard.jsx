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

  // Deporte principal si lo hay
  const deportePrincipal = experienciaDeportiva[0]?.deporte;

  // Inicial para avatar si no hay foto
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
      // Avisamos al padre para que recargue la lista
      if (onEliminado) onEliminado();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("Error al eliminar el cliente");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      {/* Cabecera: avatar + nombre + estado */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {fotoPerfilUrl ? (
            <img
              src={fotoPerfilUrl}
              alt={nombreCompleto}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {inicial}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm md:text-base">
              {nombreCompleto || "Cliente sin nombre"}
            </h3>
            {deportePrincipal && (
              <p className="text-xs text-slate-500">{deportePrincipal}</p>
            )}
          </div>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            estado === "activo"
              ? "bg-emerald-100 text-emerald-700"
            : estado === "pausado"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {traducirEstado(estado)}
        </span>
      </div>

      {/* Objetivos / nivel */}
      <div className="text-xs text-slate-600 space-y-1">
        <p>
          <span className="font-medium">Objetivo:</span>{" "}
          {traducirObjetivo(objetivoPrincipal)}
        </p>
        <p>
          <span className="font-medium">Nivel:</span>{" "}
          {traducirNivel(nivelGeneral)}
        </p>
      </div>

      {/* Rutina actual */}
      <div className="text-xs text-slate-600">
        <span className="font-medium">Rutina actual:</span>{" "}
        {rutinaActiva ? "Rutina asignada" : "Sin rutina asignada"}
      </div>

      {/* Footer: eliminar + ver detalles */}
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
          to={`/clientes/${cliente._id}`}
          className="text-xs px-3 py-1 rounded border border-slate-200 hover:bg-slate-50"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
