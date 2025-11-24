import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginRequest } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setCargando(true);

    try {
      const data = await loginRequest(correo, contrasena);
      login(data.token, data.entrenador);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMensajeError(error.response?.data?.mensaje || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-korus-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fadeIn">

        {/* LOGO */}
        <div className="text-center mb-8 select-none">
          <h1
            className="
             font-bold text-6xl bg-gradient-to-r from-korus-primary to-orange-400 bg-clip-text text-transparent tracking-tight select-none
            "
          >
            KORUS
          </h1>

          <p className="text-korus-textMuted text-sm mt-2">
            Panel de entrenador • Accede a tu cuenta
          </p>
        </div>

        {/* TARJETA CON BORDE DEGRADADO */}
        <div
          className="
            p-[2px] rounded-2xl
            bg-gradient-to-r from-blue-500 via-sky-400 to-orange-400
            shadow-xl
          "
        >
          <div className="bg-korus-card/95 rounded-2xl p-6 space-y-5">

            {mensajeError && (
              <div className="bg-korus-danger/10 border border-korus-danger/40 text-korus-danger text-sm px-3 py-2 rounded-lg">
                {mensajeError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* INPUT EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1 tracking-wide">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-lg
                    bg-korus-bg border border-korus-border 
                    text-slate-100 text-sm
                    placeholder:text-korus-textMuted/70
                    focus:outline-none focus:ring-2 focus:ring-orange-400/60
                    focus:border-orange-300 transition-all
                  "
                  placeholder="tuemail@ejemplo.com"
                />
              </div>

              {/* INPUT PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-korus-textMuted mb-1 tracking-wide">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="
                    w-full px-3 py-2 rounded-lg
                    bg-korus-bg border border-korus-border 
                    text-slate-100 text-sm
                    placeholder:text-korus-textMuted/70
                    focus:outline-none focus:ring-2 focus:ring-orange-400/60
                    focus:border-orange-300 transition-all
                  "
                  placeholder="••••••••"
                />
              </div>

              {/* BOTÓN */}
              <button
                type="submit"
                disabled={cargando}
                className={`
                  w-full py-2.5 rounded-xl text-sm font-semibold text-white shadow 
                  transition-all
                  ${
                    cargando
                      ? "bg-korus-primary/40 cursor-not-allowed"
                      : "bg-korus-primary hover:bg-korus-primary/90 hover:shadow-lg"
                  }
                `}
              >
                {cargando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="text-[11px] text-korus-textMuted text-center mt-4">
              Proyecto educativo • Generador de rutinas para entrenadores
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
