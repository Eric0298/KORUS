import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearClienteRequest,
} from "../../services/clientesService";
import ClienteCard from "../../components/clientes/ClienteCard";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mensajeExito, setMensajeExito] = useState("");
  const [cargandoCrear, setCargandoCrear] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoObjetivo, setNuevoObjetivo] = useState("ganancia_muscular");
  const [nuevoNivel, setNuevoNivel] = useState("principiante");

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const data = await obtenerClientes();
      setClientes(data.clientes || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar clientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleCrearCliente = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");
    setCargandoCrear(true);

    if (!nuevoNombre.trim()) {
      setError("El nombre es obligatorio");
      setCargandoCrear(false); // 👈 importante: quitar loading si falla validación
      return;
    }

    try {
      await crearClienteRequest({
        nombre: nuevoNombre,
        objetivoPrincipal: nuevoObjetivo,
        nivelGeneral: nuevoNivel,
      });

      setNuevoNombre("");
      setNuevoObjetivo("ganancia_muscular");
      setNuevoNivel("principiante");
      setMensajeExito("Cliente creado correctamente");

      await cargarClientes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || "Error al crear cliente");
    } finally {
      setCargandoCrear(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      {/* Formulario crear cliente sencillo */}
      <form
        onSubmit={handleCrearCliente}
        className="bg-white p-4 rounded-lg shadow space-y-4 max-w-xl"
      >
        <h2 className="font-semibold text-lg">Nuevo cliente</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {mensajeExito && (
          <p className="text-green-600 text-sm">{mensajeExito}</p>
        )}

        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Objetivo principal</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={nuevoObjetivo}
              onChange={(e) => setNuevoObjetivo(e.target.value)}
            >
              <option value="perdida_grasa">Pérdida de grasa</option>
              <option value="ganancia_muscular">Ganancia muscular</option>
              <option value="rendimiento">Rendimiento</option>
              <option value="salud_general">Salud general</option>
              <option value="rehabilitacion">Rehabilitación</option>
              <option value="competicion">Competición</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel general</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={nuevoNivel}
              onChange={(e) => setNuevoNivel(e.target.value)}
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="competicion">Competición</option>
              <option value="elite">Élite</option>
            </select>
          </div>
        </div>

        <button
          disabled={cargandoCrear}
          className={`px-4 py-2 rounded text-sm text-white ${
            cargandoCrear
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cargandoCrear ? "Creando..." : "Crear cliente"}
        </button>
      </form>

      {/* Listado de clientes en cards */}
      <div className="bg-transparent">
        <h2 className="font-semibold text-lg mb-3">Clientes</h2>

        {cargando ? (
          <p>Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no hay clientes.</p>
        ) : (
          <>
            {/* Grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {clientes.map((c) => (
                <ClienteCard
                  key={c._id}
                  cliente={c}
                  onEliminado={cargarClientes} // 👈 para refrescar tras eliminar
                />
              ))}
            </div>

            {/* Vista tabla (resumen) opcional */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-sm mb-2">
                Vista tabla (resumen)
              </h3>
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Objetivo</th>
                    <th className="py-2">Nivel</th>
                    <th className="py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c._id} className="border-b last:border-0">
                      <td className="py-2">
                        {c.nombreMostrar || c.nombre}
                      </td>
                      <td className="py-2">{c.objetivoPrincipal}</td>
                      <td className="py-2">{c.nivelGeneral}</td>
                      <td className="py-2">{c.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
