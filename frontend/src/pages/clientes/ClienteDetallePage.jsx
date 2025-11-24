import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  obtenerClientePorId,
  actualizarClienteRequest,
  eliminarClienteRequest,
} from "../../services/clientesService";

import {
  obtenerRutinas,
  asignarRutinaAClienteRequest,
  quitarRutinaActivaRequest,
} from "../../services/rutinasService";

export default function ClienteDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mensajeExito, setMensajeExito] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [rutinas, setRutinas] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState("");
  const [asignandoRutina, setAsignandoRutina] = useState(false);
  const [quitandoRutina, setQuitandoRutina] = useState(false);

  // 👉 NUEVO: controlar si el formulario está plegado/desplegado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 🔹 Datos personales
  const [nombreCompletoForm, setNombreCompletoForm] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("no-especifica");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  // 🔹 Objetivos y nivel
  const [objetivoPrincipal, setObjetivoPrincipal] =
    useState("salud_general");
  const [objetivoSecundario, setObjetivoSecundario] = useState("ninguno");
  const [nivelGeneral, setNivelGeneral] = useState("principiante");
  const [estado, setEstado] = useState("activo");
  const [descripcionObjetivos, setDescripcionObjetivos] = useState("");
  const [notas, setNotas] = useState("");

  // 🔹 Métricas físicas
  const [pesoInicialKg, setPesoInicialKg] = useState("");
  const [pesoActualKg, setPesoActualKg] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [porcentajeGrasa, setPorcentajeGrasa] = useState("");
  const [frecuenciaCardiacaReposo, setFrecuenciaCardiacaReposo] =
    useState("");

  // 🔹 Preferencias
  const [frecuenciaSemanalDeseada, setFrecuenciaSemanalDeseada] =
    useState("");
  const [ubicacionesTexto, setUbicacionesTexto] = useState("");
  const [materialTexto, setMaterialTexto] = useState("");
  const [limitacionesTexto, setLimitacionesTexto] = useState("");
  const [deportesPreferidosTexto, setDeportesPreferidosTexto] =
    useState("");

  // 🔹 Experiencia deportiva (editamos el primer bloque)
  const [expDeporte, setExpDeporte] = useState("");
  const [expNivel, setExpNivel] = useState("principiante");
  const [expAnos, setExpAnos] = useState("");
  const [expCompite, setExpCompite] = useState(false);
  const [expComentarios, setExpComentarios] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError("");
        setMensajeExito("");

        const [dataCliente, dataRutinas] = await Promise.all([
          obtenerClientePorId(id),
          obtenerRutinas(),
        ]);

        const cli = dataCliente.cliente;
        setCliente(cli);

        const nombreInicial =
          cli.nombreMostrar ||
          [cli.nombre, cli.apellidos].filter(Boolean).join(" ");

        // 🔹 Datos personales
        setNombreCompletoForm(nombreInicial);
        setCorreo(cli.correo || "");
        setTelefono(cli.telefono || "");
        setSexo(cli.sexo || "no-especifica");
        setFotoPerfilUrl(cli.fotoPerfilUrl || "");

        if (cli.fechaNacimiento) {
          const fecha = new Date(cli.fechaNacimiento);
          const iso = fecha.toISOString().slice(0, 10); // yyyy-mm-dd
          setFechaNacimiento(iso);
        } else {
          setFechaNacimiento("");
        }

        // 🔹 Objetivos y nivel
        setObjetivoPrincipal(cli.objetivoPrincipal || "salud_general");
        setObjetivoSecundario(cli.objetivoSecundario || "ninguno");
        setNivelGeneral(cli.nivelGeneral || "principiante");
        setEstado(cli.estado || "activo");
        setDescripcionObjetivos(cli.descripcionObjetivos || "");
        setNotas(cli.notas || "");

        // 🔹 Métricas
        setPesoInicialKg(
          cli.pesoInicialKg != null ? String(cli.pesoInicialKg) : ""
        );
        setPesoActualKg(
          cli.pesoActualKg != null ? String(cli.pesoActualKg) : ""
        );
        setAlturaCm(cli.alturaCm != null ? String(cli.alturaCm) : "");
        setPorcentajeGrasa(
          cli.porcentajeGrasa != null ? String(cli.porcentajeGrasa) : ""
        );
        setFrecuenciaCardiacaReposo(
          cli.frecuenciaCardiacaReposo != null
            ? String(cli.frecuenciaCardiacaReposo)
            : ""
        );

        // 🔹 Preferencias
        const prefs = cli.preferencias || {};
        setFrecuenciaSemanalDeseada(
          prefs.frecuenciaSemanalDeseada != null
            ? String(prefs.frecuenciaSemanalDeseada)
            : ""
        );
        setUbicacionesTexto(
          (prefs.ubicacionesEntrenamiento || []).join(", ")
        );
        setMaterialTexto((prefs.materialDisponible || []).join(", "));
        setLimitacionesTexto((prefs.limitaciones || []).join(", "));
        setDeportesPreferidosTexto(
          (prefs.deportesPreferidos || []).join(", ")
        );

        // 🔹 Experiencia deportiva (primer bloque)
        const exp = (cli.experienciaDeportiva || [])[0];
        if (exp) {
          setExpDeporte(exp.deporte || "");
          setExpNivel(exp.nivel || "principiante");
          setExpAnos(
            exp.anosExperiencia != null ? String(exp.anosExperiencia) : ""
          );
          setExpCompite(Boolean(exp.compite));
          setExpComentarios(exp.comentarios || "");
        } else {
          setExpDeporte("");
          setExpNivel("principiante");
          setExpAnos("");
          setExpCompite(false);
          setExpComentarios("");
        }

        const listaRutinas = dataRutinas.rutinas || [];
        setRutinas(listaRutinas);

        if (cli.rutinaActiva) {
          setRutinaSeleccionada(cli.rutinaActiva);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar el cliente");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  const parseLista = (texto) =>
    texto
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!nombreCompletoForm.trim()) {
      setError("El nombre es obligatorio");
      // Si está plegado no lo verías, mejor abrir al primer error
      setMostrarFormulario(true);
      return;
    }

    try {
      setGuardando(true);

      // Partimos el nombre en nombre + apellidos
      const partes = nombreCompletoForm.trim().split(" ");
      const nombreSolo = partes.shift();
      const apellidos = partes.join(" ");

      // Preferencias construidas
      const preferenciasPayload = {
        frecuenciaSemanalDeseada: frecuenciaSemanalDeseada
          ? Number(frecuenciaSemanalDeseada)
          : undefined,
        ubicacionesEntrenamiento: parseLista(ubicacionesTexto),
        materialDisponible: parseLista(materialTexto),
        limitaciones: parseLista(limitacionesTexto),
        deportesPreferidos: parseLista(deportesPreferidosTexto),
      };

      // Experiencia deportiva (primer bloque)
      const expActual = [...(cliente.experienciaDeportiva || [])];
      const primerExp = {
        deporte: expDeporte || undefined,
        nivel: expNivel || "principiante",
        anosExperiencia: expAnos ? Number(expAnos) : undefined,
        compite: Boolean(expCompite),
        comentarios: expComentarios || undefined,
      };

      const hayContenidoExp =
        (primerExp.deporte && primerExp.deporte.trim() !== "") ||
        primerExp.anosExperiencia != null ||
        primerExp.comentarios ||
        primerExp.compite;

      if (hayContenidoExp) {
        if (expActual.length === 0) {
          expActual.push(primerExp);
        } else {
          expActual[0] = primerExp;
        }
      }

      const payload = {
        nombre: nombreSolo,
        apellidos,
        nombreMostrar: nombreCompletoForm,
        correo: correo || undefined,
        telefono: telefono || undefined,
        fechaNacimiento: fechaNacimiento || undefined,
        sexo,
        fotoPerfilUrl: fotoPerfilUrl || undefined,

        objetivoPrincipal,
        objetivoSecundario,
        nivelGeneral,
        estado,
        descripcionObjetivos,
        notas,

        pesoInicialKg: pesoInicialKg ? Number(pesoInicialKg) : undefined,
        pesoActualKg: pesoActualKg ? Number(pesoActualKg) : undefined,
        alturaCm: alturaCm ? Number(alturaCm) : undefined,
        porcentajeGrasa: porcentajeGrasa
          ? Number(porcentajeGrasa)
          : undefined,
        frecuenciaCardiacaReposo: frecuenciaCardiacaReposo
          ? Number(frecuenciaCardiacaReposo)
          : undefined,

        preferencias: preferenciasPayload,
        experienciaDeportiva: expActual,
      };

      const data = await actualizarClienteRequest(id, payload);
      setCliente(data.cliente);
      setMensajeExito("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje || "Error al guardar los cambios"
      );
      // En caso de error, aseguramos que el formulario esté visible
      setMostrarFormulario(true);
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

  const handleAsignarRutina = async (e) => {
    e.preventDefault();
    if (!rutinaSeleccionada) return;

    try {
      setAsignandoRutina(true);
      setMensajeExito("");
      setError("");

      const data = await asignarRutinaAClienteRequest(
        rutinaSeleccionada,
        id
      );

      setCliente(data.cliente);
      setMensajeExito("Rutina asignada correctamente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje ||
          "Error al asignar la rutina al cliente"
      );
    } finally {
      setAsignandoRutina(false);
    }
  };

  const handleQuitarRutina = async () => {
    if (!cliente?.rutinaActiva) return;

    const ok = window.confirm(
      "¿Seguro que quieres quitar la rutina activa de este cliente?"
    );
    if (!ok) return;

    try {
      setQuitandoRutina(true);
      setMensajeExito("");
      setError("");

      const data = await quitarRutinaActivaRequest(id);
      setCliente(data.cliente);
      setRutinaSeleccionada("");
      setMensajeExito("Rutina activa eliminada del cliente ✅");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.mensaje ||
          "Error al quitar la rutina activa del cliente"
      );
    } finally {
      setQuitandoRutina(false);
    }
  };

  if (cargando) {
    return (
      <p className="text-sm text-korus-textMuted">Cargando cliente...</p>
    );
  }

  if (error && !cliente) {
    return (
      <div className="space-y-4">
        <p className="text-korus-danger text-sm">{error}</p>
        <Link
          to="/clientes"
          className="inline-block text-sm text-korus-primary hover:underline"
        >
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-korus-textMuted">
          Cliente no encontrado.
        </p>
        <Link
          to="/clientes"
          className="inline-block text-sm text-korus-primary hover:underline"
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
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-korus-textMuted">
            Cliente
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {nombreCompleto}
          </h1>
        </div>
        <Link
          to="/clientes"
          className="text-xs px-3 py-1 rounded-xl border border-korus-border text-korus-textMuted hover:text-korus-primary hover:border-korus-primary/70 transition"
        >
          ← Volver a clientes
        </Link>
      </div>

      {/* BLOQUE: EDICIÓN COMPLETA PLEGABLE */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-4 max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">Editar cliente</h2>
            <p className="text-xs text-korus-textMuted">
              Datos personales, objetivos, métricas y preferencias en un solo
              formulario.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMostrarFormulario((prev) => !prev)}
              className="text-xs px-3 py-1 rounded-xl border border-korus-border text-slate-200 hover:bg-korus-border/40 transition"
            >
              {mostrarFormulario ? "Ocultar formulario" : "Editar datos"}
            </button>

            <button
              type="button"
              onClick={handleEliminarCliente}
              disabled={eliminando}
              className={`text-xs px-3 py-1 rounded-xl border ${
                eliminando
                  ? "border-korus-danger/40 text-korus-danger/40 cursor-not-allowed"
                  : "border-korus-danger text-korus-danger hover:bg-korus-danger/10"
              } transition`}
            >
              {eliminando ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>

        {/* Mensajes arriba para que se vean aunque esté plegado */}
        {error && (
          <p className="text-korus-danger text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {mensajeExito && (
          <p className="text-korus-success text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            {mensajeExito}
          </p>
        )}

        {mostrarFormulario && (
          <form
            onSubmit={handleGuardarCambios}
            className="space-y-5 text-sm text-slate-200"
          >
            {/* Subform: Datos personales */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
                Datos personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={nombreCompletoForm}
                    onChange={(e) =>
                      setNombreCompletoForm(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Sexo
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                    <option value="no-especifica">No especifica</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Foto (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={fotoPerfilUrl}
                    onChange={(e) => setFotoPerfilUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Subform: Objetivos y nivel */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
                Objetivos y nivel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Objetivo principal
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                    value={objetivoPrincipal}
                    onChange={(e) => setObjetivoPrincipal(e.target.value)}
                  >
                    <option value="perdida_grasa">Pérdida de grasa</option>
                    <option value="ganancia_muscular">
                      Ganancia muscular
                    </option>
                    <option value="rendimiento">Rendimiento</option>
                    <option value="salud_general">Salud general</option>
                    <option value="rehabilitacion">Rehabilitación</option>
                    <option value="competicion">Competición</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Objetivo secundario
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                    value={objetivoSecundario}
                    onChange={(e) =>
                      setObjetivoSecundario(e.target.value)
                    }
                  >
                    <option value="ninguno">Ninguno</option>
                    <option value="perdida_grasa">Pérdida de grasa</option>
                    <option value="ganancia_muscular">
                      Ganancia muscular
                    </option>
                    <option value="rendimiento">Rendimiento</option>
                    <option value="salud_general">Salud general</option>
                    <option value="rehabilitacion">Rehabilitación</option>
                    <option value="competicion">Competición</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Nivel general
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
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

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Estado
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="pausado">Pausado</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="archivado">Archivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Descripción de objetivos
                </label>
                <textarea
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  rows={3}
                  value={descripcionObjetivos}
                  onChange={(e) =>
                    setDescripcionObjetivos(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                  Notas del entrenador
                </label>
                <textarea
                  className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </div>

            {/* Subform: Métricas físicas */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
                Métricas físicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Peso inicial (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={pesoInicialKg}
                    onChange={(e) => setPesoInicialKg(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Peso actual (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={pesoActualKg}
                    onChange={(e) => setPesoActualKg(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={alturaCm}
                    onChange={(e) => setAlturaCm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    % Grasa
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={porcentajeGrasa}
                    onChange={(e) => setPorcentajeGrasa(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    FC reposo (bpm)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={frecuenciaCardiacaReposo}
                    onChange={(e) =>
                      setFrecuenciaCardiacaReposo(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Subform: Preferencias */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
                Preferencias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Frecuencia semanal deseada (sesiones)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={frecuenciaSemanalDeseada}
                    onChange={(e) =>
                      setFrecuenciaSemanalDeseada(e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Ubicaciones (coma separadas)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={ubicacionesTexto}
                    onChange={(e) => setUbicacionesTexto(e.target.value)}
                    placeholder="Gimnasio, casa, parque..."
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Material disponible (coma separadas)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={materialTexto}
                    onChange={(e) => setMaterialTexto(e.target.value)}
                    placeholder="Mancuernas, barra, gomas..."
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Limitaciones (coma separadas)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={limitacionesTexto}
                    onChange={(e) =>
                      setLimitacionesTexto(e.target.value)
                    }
                    placeholder="Lumbares, rodilla izquierda..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Deportes preferidos (coma separadas)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={deportesPreferidosTexto}
                    onChange={(e) =>
                      setDeportesPreferidosTexto(e.target.value)
                    }
                    placeholder="Fútbol, running, pádel..."
                  />
                </div>
              </div>
            </div>

            {/* Subform: Experiencia deportiva (principal) */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-korus-textMuted">
                Experiencia deportiva (principal)
              </h3>
              <p className="text-xs text-korus-textMuted">
                Editas la experiencia deportiva principal. El resto de
                entradas se mantienen tal como están.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Deporte
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={expDeporte}
                    onChange={(e) => setExpDeporte(e.target.value)}
                    placeholder="Powerlifting, running..."
                  />
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Nivel
                  </label>
                  <select
                    className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
                    value={expNivel}
                    onChange={(e) => setExpNivel(e.target.value)}
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="competicion">Competición</option>
                    <option value="elite">Élite</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Años de experiencia
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    value={expAnos}
                    onChange={(e) => setExpAnos(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <input
                    id="expCompite"
                    type="checkbox"
                    className="w-4 h-4"
                    checked={expCompite}
                    onChange={(e) => setExpCompite(e.target.checked)}
                  />
                  <label
                    htmlFor="expCompite"
                    className="text-xs text-korus-textMuted uppercase tracking-wide"
                  >
                    Compite
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
                    Comentarios
                  </label>
                  <textarea
                    className="w-full bg-transparent border border-korus-border rounded-xl px-3 py-2 text-sm text-korus-text focus:outline-none focus:ring-1 focus:ring-korus-primary"
                    rows={2}
                    value={expComentarios}
                    onChange={(e) =>
                      setExpComentarios(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Botón guardar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={guardando}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white ${
                  guardando
                    ? "bg-korus-primary/40 cursor-not-allowed"
                    : "bg-korus-primary hover:bg-blue-500"
                } transition`}
              >
                {guardando ? "Guardando..." : "Guardar todos los cambios"}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Bloque: Asignar rutina activa */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-3 max-w-xl">
        <h2 className="font-semibold text-lg">Rutina activa</h2>

        <p className="text-xs text-korus-textMuted">
          Asigna una de tus rutinas a este cliente como rutina actual.
        </p>

        <form onSubmit={handleAsignarRutina} className="space-y-3 text-sm">
          <div>
            <label className="block mb-1 text-korus-textMuted text-xs uppercase tracking-wide">
              Seleccionar rutina
            </label>
            <select
              className="w-full rounded-xl border border-korus-border bg-white text-slate-900 text-sm px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-korus-accent/60 focus:border-korus-accent/60"
              value={rutinaSeleccionada || ""}
              onChange={(e) => setRutinaSeleccionada(e.target.value)}
            >
              <option value="">-- Sin rutina --</option>
              {rutinas.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!rutinaSeleccionada || asignandoRutina}
              className={`px-4 py-2 rounded-xl text-xs font-medium text-white ${
                !rutinaSeleccionada || asignandoRutina
                  ? "bg-korus-primary/40 cursor-not-allowed"
                  : "bg-korus-primary hover:bg-blue-500"
              } transition`}
            >
              {asignandoRutina ? "Asignando..." : "Asignar rutina activa"}
            </button>

            <button
              type="button"
              onClick={handleQuitarRutina}
              disabled={!cliente.rutinaActiva || quitandoRutina}
              className={`px-4 py-2 rounded-xl text-xs font-medium border ${
                !cliente.rutinaActiva || quitandoRutina
                  ? "border-korus-border text-korus-textMuted cursor-not-allowed"
                  : "border-korus-border text-slate-200 hover:bg-korus-border/40"
              } transition`}
            >
              {quitandoRutina ? "Quitando..." : "Quitar rutina activa"}
            </button>
          </div>
        </form>
      </section>

      {/* Secciones resumen */}
      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Datos básicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">Correo:</span>{" "}
            {cliente.correo || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Teléfono:</span>{" "}
            {cliente.telefono || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Fecha de nacimiento:
            </span>{" "}
            {cliente.fechaNacimiento
              ? new Date(cliente.fechaNacimiento).toLocaleDateString("es-ES")
              : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Sexo:</span>{" "}
            {cliente.sexo || "-"}
          </p>
        </div>
      </section>

      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Métricas físicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">
              Peso inicial:
            </span>{" "}
            {cliente.pesoInicialKg ? `${cliente.pesoInicialKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Peso actual:
            </span>{" "}
            {cliente.pesoActualKg ? `${cliente.pesoActualKg} kg` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">Altura:</span>{" "}
            {cliente.alturaCm ? `${cliente.alturaCm} cm` : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">% Grasa:</span>{" "}
            {cliente.porcentajeGrasa
              ? `${cliente.porcentajeGrasa}%`
              : "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              FC reposo:
            </span>{" "}
            {cliente.frecuenciaCardiacaReposo
              ? `${cliente.frecuenciaCardiacaReposo} bpm`
              : "-"}
          </p>
        </div>
      </section>

      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Preferencias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-200">
          <p>
            <span className="font-medium text-korus-textMuted">
              Frecuencia semanal deseada:
            </span>{" "}
            {preferencias.frecuenciaSemanalDeseada || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Ubicaciones:
            </span>{" "}
            {(preferencias.ubicacionesEntrenamiento || []).join(", ") ||
              "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Material disponible:
            </span>{" "}
            {(preferencias.materialDisponible || []).join(", ") || "-"}
          </p>
          <p>
            <span className="font-medium text-korus-textMuted">
              Limitaciones:
            </span>{" "}
            {(preferencias.limitaciones || []).join(", ") || "-"}
          </p>
          <p className="md:col-span-2">
            <span className="font-medium text-korus-textMuted">
              Deportes preferidos:
            </span>{" "}
            {(preferencias.deportesPreferidos || []).join(", ") || "-"}
          </p>
        </div>
      </section>

      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Experiencia deportiva</h2>
        {experienciaDeportiva.length === 0 ? (
          <p className="text-sm text-korus-textMuted">
            Sin experiencia registrada.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-200">
            {experienciaDeportiva.map((exp, idx) => (
              <li
                key={idx}
                className="border border-korus-border rounded-xl p-3 bg-black/20"
              >
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Deporte:
                  </span>{" "}
                  {exp.deporte}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Nivel:
                  </span>{" "}
                  {exp.nivel}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Años experiencia:
                  </span>{" "}
                  {exp.anosExperiencia ?? "-"}
                </p>
                <p>
                  <span className="font-medium text-korus-textMuted">
                    Compite:
                  </span>{" "}
                  {exp.compite ? "Sí" : "No"}
                </p>
                {exp.comentarios && (
                  <p>
                    <span className="font-medium text-korus-textMuted">
                      Comentarios:
                    </span>{" "}
                    {exp.comentarios}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-korus-card border border-korus-border rounded-2xl p-4 md:p-5 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Notas del entrenador</h2>
        <p className="text-sm text-slate-200">
          {cliente.notas || "Sin notas registradas."}
        </p>
      </section>
    </div>
  );
}
