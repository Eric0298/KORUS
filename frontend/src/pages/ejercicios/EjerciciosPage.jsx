// src/pages/ejercicios/EjerciciosPage.jsx
import { useEffect, useState } from "react";
import {
  obtenerEjercicios,
  crearEjercicioRequest,
} from "../../services/ejerciciosServices";
import EjercicioCard from "../../components/ejercicios/EjercicioCard";

export default function EjerciciosPage() {
  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoCrear, setCargandoCrear] = useState(false);

  // Formulario de nuevo ejercicio
  const [nombre, setNombre] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [etiquetasTexto, setEtiquetasTexto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarEjercicios = async () => {
    try {
      setCargando(true);
      const data = await obtenerEjercicios();
      setEjercicios(data.ejercicios || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar ejercicios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const handleCrearEjercicio = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!nombre.trim()) {
      setError("El nombre del ejercicio es obligatorio");
      return;
    }

    try {
      setCargandoCrear(true);

      const etiquetas = etiquetasTexto
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await crearEjercicioRequest({
        nombre: nombre.trim(),
        grupoMuscular: grupoMuscular.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        etiquetas,
      });

      setNombre("");
      setGrupoMuscular("");
      setEtiquetasTexto("");
      setDescripcion("");
      setMensajeExito("Ejercicio creado correctamente ✅");
      await cargarEjercicios();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje || "Error al crear el ejercicio"
      );
    } finally {
      setCargandoCrear(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-korus-text">
          Ejercicios
        </h1>
        <p className="text-sm text-korus-textMuted mt-1">
          Gestiona tu catálogo de ejercicios para construir rutinas rápidas y profesionales.
        </p>
      </div>

     {/* TARJETA CREACIÓN RÁPIDA EJERCICIO (mismo estilo que Rutinas) */}
<div className="max-w-3xl">
  <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-sky-400 to-orange-400 shadow-xl">
    <form
      onSubmit={handleCrearEjercicio}
      className="bg-korus-card/95 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg text-korus-text">
          Nuevo ejercicio
        </h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-korus-primarySoft text-korus-primary">
          catálogo personal
        </span>
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

      {/* Primera fila: nombre + grupo muscular */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-korus-textMuted mb-1">
            NOMBRE DEL EJERCICIO
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                       placeholder:text-korus-textMuted/70
                       focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Press banca, sentadilla, remo con barra..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-korus-textMuted mb-1">
            GRUPO MUSCULAR
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                       placeholder:text-korus-textMuted/70
                       focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
            placeholder="Pecho, espalda, pierna, fullbody..."
            value={grupoMuscular}
            onChange={(e) => setGrupoMuscular(e.target.value)}
          />
        </div>
      </div>

      {/* Etiquetas */}
      <div>
        <label className="block text-xs font-semibold text-korus-textMuted mb-1">
          ETIQUETAS (SEPARADAS POR COMA)
        </label>
        <input
          type="text"
          className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                     placeholder:text-korus-textMuted/70
                     focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
          placeholder="press banca, barra, fuerza..."
          value={etiquetasTexto}
          onChange={(e) => setEtiquetasTexto(e.target.value)}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-semibold text-korus-textMuted mb-1">
          DESCRIPCIÓN
        </label>
        <textarea
          className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                     placeholder:text-korus-textMuted/70
                     focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
          rows={2}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Notas técnicas rápidas para recordar la ejecución..."
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
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
        {cargandoCrear ? "Creando..." : "Crear ejercicio"}
      </button>
    </form>
  </div>
</div>

      {/* Listado de ejercicios */}
      <div>
        <h2 className="font-semibold text-lg mb-3 text-korus-text">
          Listado de ejercicios
        </h2>

        {cargando ? (
          <p className="text-sm text-korus-textMuted">Cargando ejercicios...</p>
        ) : ejercicios.length === 0 ? (
          <p className="text-sm text-korus-textMuted">
            Aún no hay ejercicios registrados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ejercicios.map((ej) => (
              <EjercicioCard
                key={ej._id}
                ejercicio={ej}
                onEliminado={cargarEjercicios}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
