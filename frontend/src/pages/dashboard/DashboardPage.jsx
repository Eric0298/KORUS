import { useEffect, useState } from "react";
import { obtenerClientes } from "../../services/clientesService";
import { obtenerRutinas } from "../../services/rutinasService";
import { obtenerEjercicios } from "../../services/ejerciciosServices";

export default function DashboardPage(){
    const [totalClientes, setTotalClientes] = useState(0);
  const [totalRutinas, setTotalRutinas] = useState(0);
  const [totalEjercicios, setTotalEjercicios] = useState(0);

   const [ultimosClientes, setUltimosClientes] = useState([]);
  const [ultimasRutinas, setUltimasRutinas] = useState([]);
  const [ultimosEjercicios, setUltimosEjercicios] = useState([]);

  const [cargando, setCargando] = useState(true);
  useEffect(()=>{
   const cargarDatos = async ()=>{
    try {
        setCargando(true);
        const [dataClientes, dataRutinas, dataEjercicios] = await Promise.all([
            obtenerClientes(),
            obtenerRutinas(),
            obtenerEjercicios(),
        ]);
        const clientes = dataClientes.clientes||[];
        const rutinas = dataRutinas.rutinas || [];
        const ejercicios = dataEjercicios.ejercicios || [];

        setTotalClientes(clientes.length);
        setTotalRutinas(rutinas.length);
        setTotalEjercicios(ejercicios.length);

        setUltimosClientes(clientes.slice(0,3));
        setUltimasRutinas(rutinas.slice(0,3));
        setUltimosEjercicios(ejercicios.slice(0,3));
    } catch (error) {
        console.error("Error cargando datos del dashboard: ", error);
    }finally{
        setCargando(false);
    }
   } ;
   cargarDatos();
  },[]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard KORUS</h1>
      <p className="text-sm text-slate-600">
        Resumen general de tu actividad como entrenador.
      </p>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-slate-500">Clientes</h2>
          <p className="text-3xl font-bold text-blue-600">{totalClientes}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-slate-500">Rutinas</h2>
          <p className="text-3xl font-bold text-emerald-600">{totalRutinas}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm text-slate-500">Ejercicios</h2>
          <p className="text-3xl font-bold text-purple-600">
            {totalEjercicios}
          </p>
        </div>
      </div>

      {/* Listas de últimos elementos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Últimos clientes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-sm">Últimos clientes</h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimosClientes.length === 0 ? (
            <p className="text-sm text-slate-500">Sin clientes aún.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {ultimosClientes.map((c) => (
                <li key={c._id}>
                  <span className="font-medium">
                    {c.nombreMostrar || c.nombre}
                  </span>
                  {c.objetivoPrincipal && (
                    <span className="text-slate-500">
                      {" "}
                      • {c.objetivoPrincipal}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Últimas rutinas */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-sm">Últimas rutinas</h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimasRutinas.length === 0 ? (
            <p className="text-sm text-slate-500">Sin rutinas aún.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {ultimasRutinas.map((r) => (
                <li key={r._id}>
                  <span className="font-medium">{r.nombre}</span>
                  {r.nivel && (
                    <span className="text-slate-500"> • {r.nivel}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Últimos ejercicios */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-sm">Últimos ejercicios</h2>
          {cargando ? (
            <p className="text-sm text-slate-500">Cargando...</p>
          ) : ultimosEjercicios.length === 0 ? (
            <p className="text-sm text-slate-500">Sin ejercicios aún.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {ultimosEjercicios.map((e) => (
                <li key={e._id}>
                  <span className="font-medium">{e.nombre}</span>
                  {e.grupoMuscular && (
                    <span className="text-slate-500">
                      {" "}
                      • {e.grupoMuscular}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}