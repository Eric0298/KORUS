import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AppLayout({ children }) {
  const { entrenador, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const nombre = entrenador?.nombre || "Entrenador";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white shadow flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-blue-600">KORUS</span>

          <nav className="hidden md:flex gap-4 text-sm text-slate-700">
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/clientes" className="hover:text-blue-600">
              Clientes
            </Link>
            <Link to="/rutinas" className="hover:text-blue-600">
              Rutinas
            </Link>
            <Link to="/ejercicios" className="hover:text-blue-600">
              Ejercicios
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-slate-600">
            {nombre}
          </span>

          {/* Avatar simple por ahora (inicial). Más adelante lo cambiamos a foto real */}
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            {inicial}
          </div>

          <button
            onClick={handleLogout}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Salir
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
