import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginRequest } from "../../services/authService";
import {useNavigate } from "react-router-dom";

export default function Login(){
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [cargando, setCargando] = useState(false);
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setMensajeError("");
        setCargando(true);
        try {
            const data = await loginRequest(correo, contrasena);
            login(data.token, data.entrenador);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setMensajeError(error.response?.data?.mensaje|| "Error al iniciar sesion");
        }finally{
          setCargando(false);
        }
    };
    return(
       <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-xl rounded-xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {mensajeError && (
          <p className="bg-red-200 text-red-700 p-2 mb-4 rounded text-sm">
            {mensajeError}
          </p>
        )}

        <label className="block mb-2 text-sm">Correo electrónico</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4 text-sm"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label className="block mb-2 text-sm">Contraseña</label>
        <input
          type="password"
          className="w-full p-2 border rounded mb-6 text-sm"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button
          type="submit"
          disabled={cargando} 
          className={`w-full py-2 rounded text-sm font-semibold text-white ${
            cargando
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {cargando ? "Entrando..." : "Entrar"} 
        </button>
      </form>
    </div> 
    );
}