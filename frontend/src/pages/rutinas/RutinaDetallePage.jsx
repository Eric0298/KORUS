import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  obtenerRutinaPorId,
  actualizarRutinaRequest,
  eliminarRutinaRequest,
} from "../../services/rutinasService";
import RutinaCard from "../../components/rutinas/RutinaCard";

export default function RutinaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rutina, setRutina] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados de edición
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("borrador");
  const [tipoSplit, setTipoSplit] = useState("");
  const [diasPorSemana, setDiasPorSemana] = useState("");
  const [semanasTotales, setSemanasTotales] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await obtenerRutinaPorId(id);
        const r = data.rutina;
        setRutina(r);

        // Inicializar formulario
        setNombre(r.nombre || "");
        setDescripcion(r.descripcion || "");
        setEstado(r.estado || "borrador");
        setTipoSplit(r.tipoSplit || "");
        setDiasPorSemana(r.diasPorSemana ?? "");
        setSemanasTotales(r.semanasTotales ?? "");
      } catch (err) {
        console.error(err);
        setError("Error al cargar la rutina");
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

      const payload = {
        nombre: nombre.trim(),
        descripcion,
        estado,
        tipoSplit,
        diasPorSemana: diasPorSemana ? Number(diasPorSemana) : undefined,
        semanasTotales: semanasTotales ? Number(semanasTotales) : undefined,
      };

      const data = await actualizarRutinaRequest(id, payload);
      setRutina(data.rutina);
      setMensajeExito("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje || "Error al guardar los cambios de la rutina"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarRutina = async () => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar esta rutina?");
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarRutinaRequest(id);
      navigate("/rutinas");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la rutina");
      setEliminando(false);
    }
  };

  if (cargando) {
    return <p>Cargando rutina...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">{error}</p>
        <Link
          to="/rutinas"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Volver a rutinas
        </Link>
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Rutina no encontrada.</p>
        <Link
          to="/rutinas"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Volver a rutinas
        </Link>
      </div>
    );
  }

  const dias = rutina.dias || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Rutina: {rutina.nombre}</h1>
        <Link
          to="/rutinas"
          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
        >
          ← Volver a rutinas
        </Link>
      </div>

      {/* Card resumen */}
      <div className="max-w-lg">
        <RutinaCard rutina={rutina} />
      </div>

      {/* Bloque de edición */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3 max-w-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Editar rutina</h2>
          <button
            type="button"
            onClick={handleEliminarRutina}
            disabled={eliminando}
            className={`text-xs px-3 py-1 rounded border border-red-200 ${
              eliminando
                ? "bg-red-100 text-red-300 cursor-not-allowed"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            {eliminando ? "Eliminando..." : "Eliminar rutina"}
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
            <label className="block mb-1">Descripción</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block mb-1">Estado</label>
              <select
                className="w-full border rounded p-2"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="borrador">Borrador</option>
                <option value="activa">Activa</option>
                <option value="plantilla">Plantilla</option>
                <option value="archivada">Archivada</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Días por semana</label>
              <input
                type="number"
                min="1"
                max="14"
                className="w-full border rounded p-2"
                value={diasPorSemana}
                onChange={(e) => setDiasPorSemana(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Semanas totales</label>
              <input
                type="number"
                min="1"
                max="52"
                className="w-full border rounded p-2"
                value={semanasTotales}
                onChange={(e) => setSemanasTotales(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Tipo split</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="fullbody, torso-pierna, empuje-tirón-pierna..."
              value={tipoSplit}
              onChange={(e) => setTipoSplit(e.target.value)}
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

      {/* Estructura de la rutina (como antes) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Días y ejercicios</h2>

        {dias.length === 0 ? (
          <p className="text-sm text-slate-600">
            Esta rutina todavía no tiene días ni ejercicios configurados.
          </p>
        ) : (
          <div className="space-y-3">
            {dias.map((dia, idxDia) => (
              <div
                key={idxDia}
                className="border rounded-lg p-3 text-sm text-slate-700"
              >
                <p className="font-semibold mb-1">
                  {dia.nombreDia || `Día ${idxDia + 1}`}{" "}
                  {dia.orden && (
                    <span className="text-slate-500">· #{dia.orden}</span>
                  )}
                </p>

                {dia.ejercicios && dia.ejercicios.length > 0 ? (
                  <ul className="list-disc ml-4 space-y-1">
                    {dia.ejercicios.map((ej, idxEj) => (
                      <li key={idxEj}>
                        <span className="font-medium">
                          {ej.nombreEjercicio}
                        </span>
                        {ej.grupoMuscular && (
                          <span className="text-slate-500">
                            {" "}
                            · {ej.grupoMuscular}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">
                    Sin ejercicios definidos en este día.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
