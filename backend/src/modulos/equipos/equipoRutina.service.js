const EquipoMiembro = require("./equipoMiembro.model");
const Cliente = require("../clientes/Cliente");
const rutinaService = require("../rutinas/rutinaService");
const ApiError = require("../../comun/core/ApiError");

const { obtenerEquipoDeEntrenador } = require("./equipoCore.service");
const { obtenerEnfoquesFisicos } = require("./perfilesFisicosPorDeporte");
const construirPlantillaRutinaFisica = (miembro, cliente, equipo) => {
  const posicion = miembro.posicion || "general";
  const estado = miembro.estado || "activo"; // activo | lesionado | rehabilitacion
  const nivel = cliente.nivelGeneral || "principiante";
  const objetivo = cliente.objetivoPrincipal || "salud_general";
  const deporte = equipo.deporte || "";
  const plantilla = {
    enfoque: [],
    volumenSesionesSemana: 3,
    intensidad: "media",
  };

  const enfoquesPosicion = obtenerEnfoquesFisicos(deporte, posicion);
  if (enfoquesPosicion.length) {
    plantilla.enfoque.push(...enfoquesPosicion);
  }

  if (estado === "lesionado" || estado === "rehabilitacion") {
    plantilla.enfoque.push("rehabilitacion_funcional");
    plantilla.intensidad = "muy_baja";
    plantilla.volumenSesionesSemana = 2;

    return {
      posicion,
      estado,
      nivel,
      objetivo,
      deporte,
      enfoque: Array.from(new Set(plantilla.enfoque)),
      volumenSesionesSemana: plantilla.volumenSesionesSemana,
      intensidad: plantilla.intensidad,
    };
  }

  if (["rendimiento", "competicion", "elite"].includes(objetivo)) {
    plantilla.enfoque.push("rendimiento");
    plantilla.volumenSesionesSemana = Math.max(
      plantilla.volumenSesionesSemana,
      4
    );
    plantilla.intensidad = "alta";
  } else if (objetivo === "perdida_grasa") {
    plantilla.enfoque.push("cardio", "fuerza_resistencia");
  } else if (objetivo === "rehabilitacion") {
    plantilla.enfoque.push(
      "movilidad",
      "estabilidad_tronco",
      "fortalecimiento_suave"
    );
    plantilla.intensidad = "baja";
    plantilla.volumenSesionesSemana = 2;
  } else {
    plantilla.enfoque.push("salud_general");
  }

  if (nivel === "principiante") {
    if (plantilla.intensidad !== "muy_baja") {
      plantilla.intensidad = "baja";
    }
    plantilla.volumenSesionesSemana = Math.min(
      plantilla.volumenSesionesSemana,
      3
    );
  } else if (nivel === "intermedio") {
  } else if (["avanzado", "competicion", "elite"].includes(nivel)) {
    if (plantilla.intensidad !== "baja") {
      plantilla.intensidad = "alta";
      plantilla.volumenSesionesSemana = Math.max(
        plantilla.volumenSesionesSemana,
        4
      );
    }
  }
  return {
    posicion,
    estado,
    nivel,
    objetivo,
    deporte,
    enfoque: Array.from(new Set(plantilla.enfoque)),
    volumenSesionesSemana: plantilla.volumenSesionesSemana,
    intensidad: plantilla.intensidad,
  };
};
const generarRutinasFisicasParaEquipo = async (
  entrenadorId,
  equipoId,
  datos
) => {
  const {
    fechaInicio,
    fechaFin,
    diasSemana,
    hora,
    notasGenerales,
    semanasTotales,
    tipoSplit,
  } = datos;

  if (!fechaInicio) {
    throw new ApiError(
      400,
      "fechaInicio es obligatoria para generar las rutinas físicas"
    );
  }

  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);
  const miembros = await EquipoMiembro.find({
    equipo: equipo._id,
    fechaBaja: { $exists: false },
  });

  if (!miembros.length) {
    throw new ApiError(400, "El equipo no tiene miembros activos");
  }

  const resultados = [];

  for (const miembro of miembros) {
    const cliente = await Cliente.findOne({
      _id: miembro.cliente,
      entrenadores: entrenadorId,
      eliminado: false,
    });

    if (!cliente) {
      continue;
    }

    const perfil = construirPlantillaRutinaFisica(miembro, cliente, equipo);

    const nombreRutina = `Rutina física - ${equipo.nombre} - ${
      cliente.nombreMostrar || cliente.nombre
    }`;

    const descripcionRutina = `Rutina física generada automáticamente para la posición "${perfil.posicion}" en el deporte "${perfil.deporte}", con objetivo "${perfil.objetivo}" e intensidad "${perfil.intensidad}".`;
    const etiquetas = [
      "auto_equipo",
      "rutina_fisica",
      `equipo:${equipo.nombre}`,
      `deporte:${perfil.deporte}`,
      `posicion:${perfil.posicion}`,
      `intensidad:${perfil.intensidad}`,
      ...perfil.enfoque.map((e) => `enfoque:${e}`),
    ];

    const dataRutina = {
      clienteId: cliente._id,
      nombre: nombreRutina,
      descripcion: descripcionRutina,
      objetivo: perfil.objetivo, 
      nivel: perfil.nivel,       
      tipoSplit: tipoSplit || null,
      diasPorSemana: perfil.volumenSesionesSemana,
      semanasTotales: semanasTotales || undefined,
      dias: [],                 
      esPlantilla: false,
      etiquetas,
      fechaInicioUso: fechaInicio,
      fechaFinUso: fechaFin || null,
      marcarComoActiva: true,    
    };

    const nuevaRutina = await rutinaService.crearRutina(
      entrenadorId,
      dataRutina
    );

    miembro.rutinasIndividuales.push({
      rutina: nuevaRutina._id,
      fechaInicio,
      fechaFin: fechaFin || null,
      diasSemana: Array.isArray(diasSemana) ? diasSemana : [],
      hora: hora || null,
      notas:
        notasGenerales ||
        `Rutina física generada automáticamente el ${new Date().toISOString()}`,
      origen: "individual",
    });

    await miembro.save();

    resultados.push({
      miembroId: miembro._id,
      clienteId: cliente._id,
      rutinaId: nuevaRutina._id,
      perfil,
    });
  }

  if (!resultados.length) {
    throw new ApiError(
      400,
      "No se pudo generar rutina para ningún miembro (clientes no válidos o no asociados)"
    );
  }

  return {
    equipoId: equipo._id,
    miembrosProcesados: resultados.length,
    detalles: resultados,
  };
};

const obtenerCalendarioMiembroEquipo = async (
  entrenadorId,
  equipoId,
  miembroId
) => {
  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const miembro = await EquipoMiembro.findById(miembroId)
    .populate("equipo")
    .populate("rutinasIndividuales.rutina");

  if (!miembro) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo._id) !== String(equipo._id)) {
    throw new ApiError(400, "El miembro no pertenece a este equipo");
  }

  const calendarioOrdenado = [...miembro.rutinasIndividuales].sort(
    (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
  );

  return {
    miembroId: miembro._id,
    equipoId: equipo._id,
    rutinas: calendarioOrdenado,
  };
};

module.exports = {
  construirPlantillaRutinaFisica,      
  generarRutinasFisicasParaEquipo,
  obtenerCalendarioMiembroEquipo,
};
