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

import ClienteDetalleHeader from "../../components/clientes/ClienteDetalleHeader";
import ClienteEditForm from "../../components/clientes/ClienteEditForm";
import ClienteRutinaActivaSection from "../../components/clientes/ClienteRutinaActivaSection";
import ClienteResumenPaneles from "../../components/clientes/ClienteResumenPaneles";

export default function ClienteDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ⬇ ESTADOS
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [eliminando, setEliminando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Rutinas
  const [rutinas, setRutinas] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState("");
  const [asignandoRutina, setAsignandoRutina] = useState(false);
  const [quitandoRutina, setQuitandoRutina] = useState(false);

  // Form plegable
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // ⬇ MUCHOS ESTADOS (sin tocar)
  const [nombreCompletoForm, setNombreCompletoForm] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("no-especifica");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  const [objetivoPrincipal, setObjetivoPrincipal] = useState("salud_general");
  const [objetivoSecundario, setObjetivoSecundario] = useState("ninguno");
  const [nivelGeneral, setNivelGeneral] = useState("principiante");
  const [estado, setEstado] = useState("activo");
  const [descripcionObjetivos, setDescripcionObjetivos] = useState("");
  const [notas, setNotas] = useState("");

  const [pesoInicialKg, setPesoInicialKg] = useState("");
  const [pesoActualKg, setPesoActualKg] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [porcentajeGrasa, setPorcentajeGrasa] = useState("");
  const [frecuenciaCardiacaReposo, setFrecuenciaCardiacaReposo] = useState("");

  const [frecuenciaSemanalDeseada, setFrecuenciaSemanalDeseada] = useState("");
  const [ubicacionesTexto, setUbicacionesTexto] = useState("");
  const [materialTexto, setMaterialTexto] = useState("");
  const [limitacionesTexto, setLimitacionesTexto] = useState("");
  const [deportesPreferidosTexto, setDeportesPreferidosTexto] = useState("");

  const [expDeporte, setExpDeporte] = useState("");
  const [expNivel, setExpNivel] = useState("principiante");
  const [expAnos, setExpAnos] = useState("");
  const [expCompite, setExpCompite] = useState(false);
  const [expComentarios, setExpComentarios] = useState("");

  // --------------------------
  // CARGA INICIAL DEL CLIENTE
  // --------------------------
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const [dataCliente, dataRutinas] = await Promise.all([
          obtenerClientePorId(id),
          obtenerRutinas(),
        ]);

        const cli = dataCliente.cliente;
        setCliente(cli);

        // nombre
        const nombreInicial =
          cli.nombreMostrar ||
          [cli.nombre, cli.apellidos].filter(Boolean).join(" ");

        setNombreCompletoForm(nombreInicial);
        setCorreo(cli.correo || "");
        setTelefono(cli.telefono || "");
        setSexo(cli.sexo || "no-especifica");
        setFotoPerfilUrl(cli.fotoPerfilUrl || "");

        if (cli.fechaNacimiento) {
          const fecha = new Date(cli.fechaNacimiento);
          setFechaNacimiento(fecha.toISOString().slice(0, 10));
        }

        // Objetivos
        setObjetivoPrincipal(cli.objetivoPrincipal || "salud_general");
        setObjetivoSecundario(cli.objetivoSecundario || "ninguno");
        setNivelGeneral(cli.nivelGeneral || "principiante");
        setEstado(cli.estado || "activo");
        setDescripcionObjetivos(cli.descripcionObjetivos || "");
        setNotas(cli.notas || "");

        // Métricas
        setPesoInicialKg(cli.pesoInicialKg ?? "");
        setPesoActualKg(cli.pesoActualKg ?? "");
        setAlturaCm(cli.alturaCm ?? "");
        setPorcentajeGrasa(cli.porcentajeGrasa ?? "");
        setFrecuenciaCardiacaReposo(cli.frecuenciaCardiacaReposo ?? "");

        // Preferencias
        const prefs = cli.preferencias || {};
        setFrecuenciaSemanalDeseada(prefs.frecuenciaSemanalDeseada ?? "");
        setUbicacionesTexto((prefs.ubicacionesEntrenamiento || []).join(", "));
        setMaterialTexto((prefs.materialDisponible || []).join(", "));
        setLimitacionesTexto((prefs.limitaciones || []).join(", "));
        setDeportesPreferidosTexto(
          (prefs.deportesPreferidos || []).join(", ")
        );

        // Experiencia deportiva
        const exp = (cli.experienciaDeportiva || [])[0];
        if (exp) {
          setExpDeporte(exp.deporte || "");
          setExpNivel(exp.nivel || "principiante");
          setExpAnos(exp.anosExperiencia ?? "");
          setExpCompite(Boolean(exp.compite));
          setExpComentarios(exp.comentarios || "");
        }

        // Rutinas
        setRutinas(dataRutinas.rutinas || []);
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

  // -----------------------
  // HANDLERS PRINCIPALES
  // -----------------------

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
      setMostrarFormulario(true);
      return;
    }

    try {
      setGuardando(true);

      const partes = nombreCompletoForm.trim().split(" ");
      const nombreSolo = partes.shift();
      const apellidos = partes.join(" ");

      const preferenciasPayload = {
        frecuenciaSemanalDeseada: frecuenciaSemanalDeseada
          ? Number(frecuenciaSemanalDeseada)
          : undefined,
        ubicacionesEntrenamiento: parseLista(ubicacionesTexto),
        materialDisponible: parseLista(materialTexto),
        limitaciones: parseLista(limitacionesTexto),
        deportesPreferidos: parseLista(deportesPreferidosTexto),
      };

      // Experiencia
      const expActual = [...(cliente.experienciaDeportiva || [])];

      const primerExp = {
        deporte: expDeporte || undefined,
        nivel: expNivel || "principiante",
        anosExperiencia: expAnos ? Number(expAnos) : undefined,
        compite: Boolean(expCompite),
        comentarios: expComentarios || undefined,
      };

      const hayContenidoExp =
        primerExp.deporte ||
        primerExp.anosExperiencia ||
        primerExp.comentarios ||
        primerExp.compite;

      if (hayContenidoExp) {
        if (expActual.length === 0) expActual.push(primerExp);
        else expActual[0] = primerExp;
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
      setMensajeExito("Cambios guardados correctamente ");
    } catch (err) {
      console.error(err);
      setError("Error al guardar los cambios");
      setMostrarFormulario(true);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCliente = async () => {
    const ok = window.confirm("¿Eliminar cliente?");
    if (!ok) return;
    try {
      setEliminando(true);
      await eliminarClienteRequest(id);
      navigate("/clientes");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    } finally {
      setEliminando(false);
    }
  };

  const handleAsignarRutina = async (e) => {
    e.preventDefault();
    if (!rutinaSeleccionada) return;

    try {
      setAsignandoRutina(true);
      const data = await asignarRutinaAClienteRequest(rutinaSeleccionada, id);
      setCliente(data.cliente);
      setMensajeExito("Rutina asignada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al asignar rutina");
    } finally {
      setAsignandoRutina(false);
    }
  };

  const handleQuitarRutina = async () => {
    if (!cliente?.rutinaActiva) return;

    const ok = window.confirm("¿Quitar rutina activa?");
    if (!ok) return;

    try {
      setQuitandoRutina(true);
      const data = await quitarRutinaActivaRequest(id);
      setCliente(data.cliente);
      setRutinaSeleccionada("");
    } catch (err) {
      console.error(err);
      setError("Error al quitar rutina");
    } finally {
      setQuitandoRutina(false);
    }
  };

  // --------------------------
  // RENDER
  // --------------------------
  if (cargando) return <p>Cargando...</p>;
  if (!cliente) return <p>No encontrado</p>;

  const nombreCompleto =
    cliente.nombreMostrar ||
    [cliente.nombre, cliente.apellidos].filter(Boolean).join(" ");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <ClienteDetalleHeader nombreCompleto={nombreCompleto} />

      {/* FORMULARIO (modularizado) */}
      <ClienteEditForm
        mostrarFormulario={mostrarFormulario}
        onToggleFormulario={() => setMostrarFormulario((p) => !p)}

        onEliminarCliente={handleEliminarCliente}
        eliminando={eliminando}

        error={error}
        mensajeExito={mensajeExito}

        guardando={guardando}
        onSubmit={handleGuardarCambios}

        // DATOS PERSONALES
        nombreCompletoForm={nombreCompletoForm}
        onNombreCompletoChange={setNombreCompletoForm}
        correo={correo}
        onCorreoChange={setCorreo}
        telefono={telefono}
        onTelefonoChange={setTelefono}
        fechaNacimiento={fechaNacimiento}
        onFechaNacimientoChange={setFechaNacimiento}
        sexo={sexo}
        onSexoChange={setSexo}
        fotoPerfilUrl={fotoPerfilUrl}
        onFotoPerfilUrlChange={setFotoPerfilUrl}

        // OBJETIVOS
        objetivoPrincipal={objetivoPrincipal}
        onObjetivoPrincipalChange={setObjetivoPrincipal}
        objetivoSecundario={objetivoSecundario}
        onObjetivoSecundarioChange={setObjetivoSecundario}
        nivelGeneral={nivelGeneral}
        onNivelGeneralChange={setNivelGeneral}
        estado={estado}
        onEstadoChange={setEstado}
        descripcionObjetivos={descripcionObjetivos}
        onDescripcionObjetivosChange={setDescripcionObjetivos}
        notas={notas}
        onNotasChange={setNotas}

        // MÉTRICAS
        pesoInicialKg={pesoInicialKg}
        onPesoInicialKgChange={setPesoInicialKg}
        pesoActualKg={pesoActualKg}
        onPesoActualKgChange={setPesoActualKg}
        alturaCm={alturaCm}
        onAlturaCmChange={setAlturaCm}
        porcentajeGrasa={porcentajeGrasa}
        onPorcentajeGrasaChange={setPorcentajeGrasa}
        frecuenciaCardiacaReposo={frecuenciaCardiacaReposo}
        onFrecuenciaCardiacaReposoChange={setFrecuenciaCardiacaReposo}

        // PREFERENCIAS
        frecuenciaSemanalDeseada={frecuenciaSemanalDeseada}
        onFrecuenciaSemanalDeseadaChange={setFrecuenciaSemanalDeseada}
        ubicacionesTexto={ubicacionesTexto}
        onUbicacionesTextoChange={setUbicacionesTexto}
        materialTexto={materialTexto}
        onMaterialTextoChange={setMaterialTexto}
        limitacionesTexto={limitacionesTexto}
        onLimitacionesTextoChange={setLimitacionesTexto}
        deportesPreferidosTexto={deportesPreferidosTexto}
        onDeportesPreferidosTextoChange={setDeportesPreferidosTexto}

        // EXPERIENCIA
        expDeporte={expDeporte}
        onExpDeporteChange={setExpDeporte}
        expNivel={expNivel}
        onExpNivelChange={setExpNivel}
        expAnos={expAnos}
        onExpAnosChange={setExpAnos}
        expCompite={expCompite}
        onExpCompiteChange={setExpCompite}
        expComentarios={expComentarios}
        onExpComentariosChange={setExpComentarios}
      />

      {/* RUTINA ACTIVA */}
      <ClienteRutinaActivaSection
        cliente={cliente}
        rutinas={rutinas}
        rutinaSeleccionada={rutinaSeleccionada}
        onRutinaSeleccionadaChange={setRutinaSeleccionada}
        onAsignarRutina={handleAsignarRutina}
        asignandoRutina={asignandoRutina}
        onQuitarRutina={handleQuitarRutina}
        quitandoRutina={quitandoRutina}
      />

      {/* PANELES DE RESUMEN */}
      <ClienteResumenPaneles cliente={cliente} />
    </div>
  );
}
