import { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AppLayout({ children }) {
  const { entrenador, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const nombre = entrenador?.nombre || "Entrenador";
  const inicial = nombre.charAt(0).toUpperCase();

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const linkBaseClasses =
    "text-sm transition px-1 py-0.5 border-b-2 border-transparent";
  const linkActiveClasses = "text-korus-primary border-korus-primary";
  const linkInactiveClasses = "text-slate-300 hover:text-korus-primary";

  return (
    <div className="min-h-screen bg-korus-bg text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-korus-bg/90 backdrop-blur border-b border-korus-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* IZQUIERDA → Logo + menú desktop */}
          <div className="flex items-center gap-6">
            {/* LOGO KORUS */}
            <span className="             font-bold text-2xl bg-gradient-to-r from-korus-primary to-orange-400 bg-clip-text text-transparent tracking-tight select-none
">
              KORUS
            </span>

            {/* MENÚ DESKTOP */}
            <nav className="hidden md:flex gap-6">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${linkBaseClasses} ${
                    isActive ? linkActiveClasses : linkInactiveClasses
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/clientes"
                className={({ isActive }) =>
                  `${linkBaseClasses} ${
                    isActive ? linkActiveClasses : linkInactiveClasses
                  }`
                }
              >
                Clientes
              </NavLink>
              <NavLink
                to="/rutinas"
                className={({ isActive }) =>
                  `${linkBaseClasses} ${
                    isActive ? linkActiveClasses : linkInactiveClasses
                  }`
                }
              >
                Rutinas
              </NavLink>
              <NavLink
                to="/ejercicios"
                className={({ isActive }) =>
                  `${linkBaseClasses} ${
                    isActive ? linkActiveClasses : linkInactiveClasses
                  }`
                }
              >
                Ejercicios
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Nombre en desktop */}
            <span className="hidden sm:inline text-sm text-korus-textMuted">
              {nombre}
            </span>

            {/* CONTENEDOR RELATIVO PARA MENÚ USUARIO */}
            <div className="relative">
              {/* AVATAR */}
              <button
                onClick={() => {
                  setIsUserMenuOpen((prev) => !prev);
                  setIsMobileMenuOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-korus-primary text-white flex items-center justify-center font-semibold hover:opacity-90 transition shadow-sm"
              >
                {inicial}
              </button>

              {/* MENÚ DESPLEGABLE USUARIO */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 bg-korus-card border border-korus-border rounded-lg shadow-lg text-sm py-2 w-44">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 hover:bg-korus-primary/10 transition"
                    onClick={closeAllMenus}
                  >
                    Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block text-left w-full px-4 py-2 text-korus-danger hover:bg-red-500/10 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN MENÚ MOBILE */}
            <button
              onClick={() => {
                setIsMobileMenuOpen((prev) => !prev);
                setIsUserMenuOpen(false);
              }}
              className="md:hidden text-slate-300 hover:text-white text-xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MENÚ MOBILE */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-korus-card border-t border-korus-border px-4 py-3 space-y-2 text-sm">
            <NavLink
              to="/dashboard"
              onClick={closeAllMenus}
              className={({ isActive }) =>
                isActive
                  ? "block text-korus-primary"
                  : "block text-slate-300 hover:text-korus-primary"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/clientes"
              onClick={closeAllMenus}
              className={({ isActive }) =>
                isActive
                  ? "block text-korus-primary"
                  : "block text-slate-300 hover:text-korus-primary"
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/rutinas"
              onClick={closeAllMenus}
              className={({ isActive }) =>
                isActive
                  ? "block text-korus-primary"
                  : "block text-slate-300 hover:text-korus-primary"
              }
            >
              Rutinas
            </NavLink>
            <NavLink
              to="/ejercicios"
              onClick={closeAllMenus}
              className={({ isActive }) =>
                isActive
                  ? "block text-korus-primary"
                  : "block text-slate-300 hover:text-korus-primary"
              }
            >
              Ejercicios
            </NavLink>
          </nav>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
