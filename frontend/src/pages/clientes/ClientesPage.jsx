import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearClienteRequest,
} from "../../services/clientesService";
import ClienteCard from "../../components/clientes/ClienteCard";
import { GradientCard } from "../../components/common/GradientCard";

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
      setCargandoCrear(false);
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
      setMensajeExito("Cliente creado correctamente ✅");

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
      {/* Cabecera */}
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-korus-textMuted">
          Gestión
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">Clientes</h1>
        <p className="text-sm text-korus-textMuted max-w-xl">
          Crea, edita y organiza a las personas que entrenas desde un único
          panel.
        </p>
      </header>

      <div className="max-w-3xl">
        <GradientCard>
          <form onSubmit={handleCrearCliente} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-lg text-korus-text">
                Nuevo cliente
              </h2>
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

            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                NOMBRE DEL CLIENTE
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                           placeholder:text-korus-textMuted/70
                           focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre y apellidos o alias de cliente"
              />
            </div>

            {/* Objetivo + nivel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  OBJETIVO PRINCIPAL
                </label>
                <select
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60 cursor-pointer"
                  value={nuevoObjetivo}
                  onChange={(e) => setNuevoObjetivo(e.target.value)}
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
                <label className="block text-xs font-semibold text-korus-textMuted mb-1">
                  NIVEL GENERAL
                </label>
                <select
                  className="w-full rounded-xl border border-korus-border bg-korus-bg text-slate-100 text-sm px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60 cursor-pointer"
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

            {/* Botón */}
            <button
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
              {cargandoCrear ? "Creando..." : "Crear cliente"}
            </button>
          </form>
        </GradientCard>
      </div>

      {/* Listado de clientes en cards */}
      <section className="space-y-3">
        <h2 className="font-semibold text-base md:text-lg">Clientes</h2>

        {cargando ? (
          <p className="text-sm text-korus-textMuted">Cargando clientes...</p>
        ) : clientes.length === 0 ? (
          <p className="text-sm text-korus-textMuted">
            Aún no hay clientes. Crea el primero desde el formulario superior.
          </p>
        ) : (
          <>
            {/* Grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {clientes.map((c) => (
                <ClienteCard
                  key={c._id}
                  cliente={c}
                  onEliminado={cargarClientes}
                />
              ))}
            </div>

            {/* Vista tabla (resumen) */}
            <div className="bg-korus-card border border-korus-border rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 text-korus-textMuted uppercase tracking-wide">
                Vista tabla (resumen)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-korus-border text-left text-korus-textMuted">
                      <th className="py-2 pr-4 font-medium">Nombre</th>
                      <th className="py-2 pr-4 font-medium">Objetivo</th>
                      <th className="py-2 pr-4 font-medium">Nivel</th>
                      <th className="py-2 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-korus-border/60 last:border-0 text-slate-200"
                      >
                        <td className="py-2 pr-4">
                          {c.nombreMostrar || c.nombre}
                        </td>
                        <td className="py-2 pr-4">
                          {c.objetivoPrincipal || "-"}
                        </td>
                        <td className="py-2 pr-4">
                          {c.nivelGeneral || "-"}
                        </td>
                        <td className="py-2">{c.estado || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
