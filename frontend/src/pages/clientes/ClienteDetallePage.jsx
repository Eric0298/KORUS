import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  obtenerClientePorId,
  actualizarClienteRequest,
  eliminarClienteRequest,
} from "../../services/clientesService";
import ClienteCard from "../../components/clientes/ClienteCard";

export default function ClienteDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [objetivoPrincipal, setObjetivoPrincipal] = useState("salud_general");
  const [nivelGeneral, setNivelGeneral] = useState("principiante");
  const [notas, setNotas] = useState("");

  const [pesoInicialKg, setPesoInicialKg] = useState("");
  const [pesoActualKg, setPesoActualKg] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [porcentajeGrasa, setPorcentajeGrasa] = useState("");
  const [frecuenciaCardiacaReposo, setFrecuenciaCardiacaReposo] = useState("");

  
  const [frecuenciaSemanalDeseada, setFrecuenciaSemanalDeseada] = useState("");
  const [materialDisponibleTexto, setMaterialDisponibleTexto] = useState("");
  const [ubicacionesTexto, setUbicacionesTexto] = useState("");
  const [limitacionesTexto, setLimitacionesTexto] = useState("");
  const [deportesPreferidosTexto, setDeportesPreferidosTexto] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await obtenerClientePorId(id);
        const cli = data.cliente;
        setCliente(cli);

        // ---- Inicializar formulario de edición ----
        const nombreCompleto =
          cli.nombreMostrar ||
          [cli.nombre, cli.apellidos].filter(Boolean).join(" ");

        setNombre(nombreCompleto);
        setObjetivoPrincipal(cli.objetivoPrincipal || "salud_general");
        setNivelGeneral(cli.nivelGeneral || "principiante");
        setNotas(cli.notas || "");

        // Métricas físicas
        setPesoInicialKg(cli.pesoInicialKg ?? "");
        setPesoActualKg(cli.pesoActualKg ?? "");
        setAlturaCm(cli.alturaCm ?? "");
        setPorcentajeGrasa(cli.porcentajeGrasa ?? "");
        setFrecuenciaCardiacaReposo(cli.frecuenciaCardiacaReposo ?? "");

        // Preferencias
        const pref = cli.preferencias || {};
        setFrecuenciaSemanalDeseada(pref.frecuenciaSemanalDeseada ?? "");
        setMaterialDisponibleTexto(
          (pref.materialDisponible || []).join(", ")
        );
        setUbicacionesTexto((pref.ubicacionesEntrenamiento || []).join(", "));
        setLimitacionesTexto((pref.limitaciones || []).join(", "));
        setDeportesPreferidosTexto(
          (pref.deportesPreferidos || []).join(", ")
        );
      } catch (err) {
        console.error(err);
        setError("Error al cargar el cliente");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const parseNumberOrNull = (valor) => {
    if (valor === "" || valor === null || valor === undefined) return undefined;
    const num = Number(valor);
    return Number.isNaN(num) ? undefined : num;
  };

  const parseLista = (texto) => {
    if (!texto) return [];
    return texto
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

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

      // Partimos nombre completo en nombre + apellidos (simple)
      const partes = nombre.trim().split(" ");
      const nombreSolo = partes.shift();
      const apellidos = partes.join(" ");

      const preferenciasPayload = {
        frecuenciaSemanalDeseada: parseNumberOrNull(
          frecuenciaSemanalDeseada
        ),
        materialDisponible: parseLista(materialDisponibleTexto),
        ubicacionesEntrenamiento: parseLista(ubicacionesTexto),
        limitaciones: parseLista(limitacionesTexto),
        deportesPreferidos: parseLista(deportesPreferidosTexto),
      };

      const payload = {
        nombre: nombreSolo,
        apellidos,
        nombreMostrar: nombre,
        objetivoPrincipal,
        nivelGeneral,
        notas,

        // métricas físicas
        pesoInicialKg: parseNumberOrNull(pesoInicialKg),
        pesoActualKg: parseNumberOrNull(pesoActualKg),
        alturaCm: parseNumberOrNull(alturaCm),
        porcentajeGrasa: parseNumberOrNull(porcentajeGrasa),
        frecuenciaCardiacaReposo: parseNumberOrNull(
          frecuenciaCardiacaReposo
        ),

        // preferencias
        preferencias: preferenciasPayload,
      };

      const data = await actualizarClienteRequest(id, payload);
      setCliente(data.cliente);
      setMensajeExito("Cambios guardados correctamente ");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje || "Error al guardar los cambios del cliente"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCliente = async () => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar (archivar) este cliente?"
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await eliminarClienteRequest(id);
      navigate("/clientes");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el cliente");
      setEliminando(false);
    }
  };

  if (cargando) {
    return <p>Cargando cliente...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 text-sm">{error}</p>
        <Link
          to="/clientes"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Cliente no encontrado.</p>
        <Link
          to="/clientes"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  const nombreCompleto =
    cliente.nombreMostrar ||
    [cliente.nombre, cliente.apellidos].filter(Boolean).join(" ");

  const preferencias = cliente.preferencias || {};
  const experienciaDeportiva = cliente.experienciaDeportiva || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Cliente: {nombreCompleto}</h1>
        <Link
          to="/clientes"
          className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
        >
          ← Volver a clientes
        </Link>
      </div>

      {/* Resumen usando la misma card */}
      <div className="max-w-lg">
        <ClienteCard cliente={cliente} />
      </div>

      {/*  Bloque de edición completa */}
      <section className="bg-white rounded-xl shadow p-4 space-y-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Editar cliente</h2>
          <button
            type="button"
            onClick={handleEliminarCliente}
            disabled={eliminando}
            className={`text-xs px-3 py-1 rounded border border-red-200 ${
              eliminando
                ? "bg-red-100 text-red-300 cursor-not-allowed"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            {eliminando ? "Eliminando..." : "Eliminar cliente"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-green-600 text-sm">{mensajeExito}</p>
        )}

        <form onSubmit={handleGuardarCambios} className="space-y-4 text-sm">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block mb-1">Nombre completo</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Objetivo principal</label>
              <select
                className="w-full border rounded p-2"
                value={objetivoPrincipal}
                onChange={(e) => setObjetivoPrincipal(e.target.value)}
              >
                <option value="perdida_grasa">Pérdida de grasa</option>
                <option value="ganancia_muscular">Ganancia muscular</option>
                <option value="rendimiento">Rendimiento</option>
                <option value="salud_general">Salud general</option>
                <option value="rehabilitacion">Rehabilitación</option>
                <option value="competicion">Competición</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Nivel general</label>
              <select
                className="w-full border rounded p-2"
                value={nivelGeneral}
                onChange={(e) => setNivelGeneral(e.target.value)}
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="competicion">Competición</option>
                <option value="elite">Élite</option>
              </select>
            </div>
          </div>

          {/* Métricas físicas */}
          <div>
            <h3 className="font-semibold mb-2">Métricas físicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block mb-1">Peso inicial (kg)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={pesoInicialKg}
                  onChange={(e) => setPesoInicialKg(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Peso actual (kg)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={pesoActualKg}
                  onChange={(e) => setPesoActualKg(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={alturaCm}
                  onChange={(e) => setAlturaCm(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">% Grasa</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={porcentajeGrasa}
                  onChange={(e) => setPorcentajeGrasa(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">FC reposo (bpm)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={frecuenciaCardiacaReposo}
                  onChange={(e) =>
                    setFrecuenciaCardiacaReposo(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div>
            <h3 className="font-semibold mb-2">Preferencias</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">
                  Frecuencia semanal deseada (sesiones)
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={frecuenciaSemanalDeseada}
                  onChange={(e) =>
                    setFrecuenciaSemanalDeseada(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1">
                  Material disponible (separado por comas)
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={materialDisponibleTexto}
                  onChange={(e) =>
                    setMaterialDisponibleTexto(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1">
                  Ubicaciones entrenamiento (separadas por comas)
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={ubicacionesTexto}
                  onChange={(e) => setUbicacionesTexto(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1">
                  Limitaciones / lesiones (separadas por comas)
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={limitacionesTexto}
                  onChange={(e) => setLimitacionesTexto(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">
                  Deportes preferidos (separados por comas)
                </label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={deportesPreferidosTexto}
                  onChange={(e) =>
                    setDeportesPreferidosTexto(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block mb-1">Notas del entrenador</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
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

      {/* Sección: datos básicos (solo lectura de momento, sincronizados) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Datos básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Correo:</span>{" "}
            {cliente.correo || "-"}
          </p>
          <p>
            <span className="font-medium">Teléfono:</span>{" "}
            {cliente.telefono || "-"}
          </p>
          <p>
            <span className="font-medium">Fecha de nacimiento:</span>{" "}
            {cliente.fechaNacimiento
              ? new Date(cliente.fechaNacimiento).toLocaleDateString("es-ES")
              : "-"}
          </p>
          <p>
            <span className="font-medium">Sexo:</span>{" "}
            {cliente.sexo || "-"}
          </p>
        </div>
      </section>

      {/* Sección: métricas físicas (solo display) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Métricas físicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Peso inicial:</span>{" "}
            {cliente.pesoInicialKg ? `${cliente.pesoInicialKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium">Peso actual:</span>{" "}
            {cliente.pesoActualKg ? `${cliente.pesoActualKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium">Altura:</span>{" "}
            {cliente.alturaCm ? `${cliente.alturaCm} cm` : "-"}
          </p>
          <p>
            <span className="font-medium">% Grasa:</span>{" "}
            {cliente.porcentajeGrasa
              ? `${cliente.porcentajeGrasa}%`
              : "-"}
          </p>
          <p>
            <span className="font-medium">FC reposo:</span>{" "}
            {cliente.frecuenciaCardiacaReposo
              ? `${cliente.frecuenciaCardiacaReposo} bpm`
              : "-"}
          </p>
        </div>
      </section>

      {/* Sección: preferencias (solo display) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Preferencias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Frecuencia semanal deseada:</span>{" "}
            {preferencias.frecuenciaSemanalDeseada || "-"}
          </p>
          <p>
            <span className="font-medium">Ubicaciones:</span>{" "}
            {(preferencias.ubicacionesEntrenamiento || []).join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium">Material disponible:</span>{" "}
            {(preferencias.materialDisponible || []).join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium">Limitaciones:</span>{" "}
            {(preferencias.limitaciones || []).join(", ") || "-"}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium">Deportes preferidos:</span>{" "}
            {(preferencias.deportesPreferidos || []).join(", ") || "-"}
          </p>
        </div>
      </section>

      {/* Sección: experiencia deportiva */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Experiencia deportiva</h2>
        {experienciaDeportiva.length === 0 ? (
          <p className="text-sm text-slate-600">Sin experiencia registrada.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700">
            {experienciaDeportiva.map((exp, idx) => (
              <li key={idx} className="border rounded p-2">
                <p>
                  <span className="font-medium">Deporte:</span>{" "}
                  {exp.deporte}
                </p>
                <p>
                  <span className="font-medium">Nivel:</span>{" "}
                  {exp.nivel}
                </p>
                <p>
                  <span className="font-medium">Años experiencia:</span>{" "}
                  {exp.anosExperiencia ?? "-"}
                </p>
                <p>
                  <span className="font-medium">Compite:</span>{" "}
                  {exp.compite ? "Sí" : "No"}
                </p>
                {exp.comentarios && (
                  <p>
                    <span className="font-medium">Comentarios:</span>{" "}
                    {exp.comentarios}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sección: notas (display) */}
      <section className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Notas del entrenador</h2>
        <p className="text-sm text-slate-700">
          {cliente.notas || "Sin notas registradas."}
        </p>
      </section>
    </div>
  );
}
