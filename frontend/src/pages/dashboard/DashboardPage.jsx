import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { obtenerClientes } from "../../services/clientesService";
import { obtenerRutinas } from "../../services/rutinasService";
import { obtenerEjercicios } from "../../services/ejerciciosServices";

export default function DashboardPage() {
  const { entrenador } = useContext(AuthContext);

  const [totalClientes, setTotalClientes] = useState(0);
  const [totalRutinas, setTotalRutinas] = useState(0);
  const [totalEjercicios, setTotalEjercicios] = useState(0);

  const [ultimosClientes, setUltimosClientes] = useState([]);
  const [ultimasRutinas, setUltimasRutinas] = useState([]);
  const [ultimosEjercicios, setUltimosEjercicios] = useState([]);

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [dataClientes, dataRutinas, dataEjercicios] = await Promise.all([
          obtenerClientes(),
          obtenerRutinas(),
          obtenerEjercicios(),
        ]);

        const clientes = dataClientes.clientes || [];
        const rutinas = dataRutinas.rutinas || [];
        const ejercicios = dataEjercicios.ejercicios || [];

        setTotalClientes(clientes.length);
        setTotalRutinas(rutinas.length);
        setTotalEjercicios(ejercicios.length);

        setUltimosClientes(clientes.slice(0, 3));
        setUltimasRutinas(rutinas.slice(0, 3));
        setUltimosEjercicios(ejercicios.slice(0, 3));
      } catch (error) {
        console.error("Error cargando datos del dashboard: ", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const nombreEntrenador = entrenador?.nombre || "Entrenador";

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Panel de control
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Bienvenido, <span className="text-korus-primary">{nombreEntrenador}</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Este es tu resumen general en Korus. Revisa de un vistazo tus clientes,
          rutinas y ejercicios creados.
        </p>
      </header>

      {/* Tarjetas de resumen (KPI) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clientes */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4 flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Clientes
          </p>
          <p className="text-3xl font-bold text-korus-primary">
            {totalClientes}
          </p>
          <p className="text-xs text-slate-500">
            Personas activas bajo tu seguimiento.
          </p>
        </div>

        {/* Rutinas */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4 flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Rutinas
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            {totalRutinas}
          </p>
          <p className="text-xs text-slate-500">
            Programas de entrenamiento diseñados.
          </p>
        </div>

        {/* Ejercicios */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4 flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Ejercicios
          </p>
          <p className="text-3xl font-bold text-purple-400">
            {totalEjercicios}
          </p>
          <p className="text-xs text-slate-500">
            Ejercicios disponibles en tu biblioteca.
          </p>
        </div>
      </section>

      {/* Listas de últimos elementos */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Últimos clientes */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Últimos clientes</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">
              Recientes
            </span>
          </h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimosClientes.length === 0 ? (
            <p className="text-sm text-slate-500">Sin clientes aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {ultimosClientes.map((c) => (
                <li
                  key={c._id}
                  className="flex flex-col border-b border-korus-border/60 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-medium text-slate-100">
                    {c.nombreMostrar || c.nombre}
                  </span>
                  <span className="text-xs text-slate-500">
                    {c.objetivoPrincipal
                      ? `Objetivo: ${c.objetivoPrincipal}`
                      : "Sin objetivo definido"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Últimas rutinas */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Últimas rutinas</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">
              Recientes
            </span>
          </h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimasRutinas.length === 0 ? (
            <p className="text-sm text-slate-500">Sin rutinas aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {ultimasRutinas.map((r) => (
                <li
                  key={r._id}
                  className="flex flex-col border-b border-korus-border/60 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-medium text-slate-100">
                    {r.nombre}
                  </span>
                  <span className="text-xs text-slate-500">
                    {r.nivel ? `Nivel: ${r.nivel}` : "Nivel no definido"}
                    {r.diasPorSemana
                      ? ` • ${r.diasPorSemana} días/semana`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Últimos ejercicios */}
        <div className="bg-korus-card border border-korus-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center justify-between">
            <span>Últimos ejercicios</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">
              Biblioteca
            </span>
          </h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimosEjercicios.length === 0 ? (
            <p className="text-sm text-slate-500">Sin ejercicios aún.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {ultimosEjercicios.map((e) => (
                <li
                  key={e._id}
                  className="flex flex-col border-b border-korus-border/60 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-medium text-slate-100">
                    {e.nombre}
                  </span>
                  <span className="text-xs text-slate-500">
                    {e.grupoMuscular
                      ? `Grupo muscular: ${e.grupoMuscular}`
                      : "Grupo muscular no definido"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
