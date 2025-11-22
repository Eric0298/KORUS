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
      <h1 className="text-2xl font-bold">Ejercicios</h1>

      {/* Formulario crear ejercicio */}
      <form
        onSubmit={handleCrearEjercicio}
        className="bg-white p-4 rounded-lg shadow space-y-4 max-w-xl"
      >
        <h2 className="font-semibold text-lg">Nuevo ejercicio</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-green-600 text-sm">{mensajeExito}</p>
        )}

        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Grupo muscular</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="Pecho, espalda, pierna, fullbody..."
            value={grupoMuscular}
            onChange={(e) => setGrupoMuscular(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Etiquetas (coma separadas)</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="press banca, barra, fuerza..."
            value={etiquetasTexto}
            onChange={(e) => setEtiquetasTexto(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows={2}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={cargandoCrear}
          className={`px-4 py-2 rounded text-sm text-white ${
            cargandoCrear
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cargandoCrear ? "Creando..." : "Crear ejercicio"}
        </button>
      </form>

      {/* Listado de ejercicios */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Listado de ejercicios</h2>

        {cargando ? (
          <p>Cargando ejercicios...</p>
        ) : ejercicios.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay ejercicios.</p>
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
