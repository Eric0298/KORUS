const Rutina = require("./Rutina");
const Cliente = require("../clientes/Cliente");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const camposPermitidosActualizar = [
  "nombre",
  "descripcion",
  "objetivo",
  "nivel",
  "tipoSplit",
  "diasPorSemana",
  "semanasTotales",
  "dias",
  "estado",
  "esPlantilla",
  "fechaInicioUso",
  "fechaFinUso",
  "etiquetas",
];

const crearRutina = async (entrenadorId, data) => {
  const {
    clienteId,
    nombre,
    descripcion,
    objetivo,
    nivel,
    tipoSplit,
    diasPorSemana,
    semanasTotales,
    dias,
    esPlantilla,
    etiquetas,
    fechaInicioUso,
    fechaFinUso,
    marcarComoActiva,
  } = data;

  if (!nombre) {
    const error = new Error("El nombre de la rutina es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  let cliente = null;

  if (clienteId) {
    cliente = await Cliente.findOne({
      _id: clienteId,
      entrenadores: entrenadorId, 
      eliminado: false,
    });

    if (!cliente) {
      const error = new Error(
        "Cliente no encontrado o no pertenece al entrenador autenticado"
      );
      error.statusCode = 404;
      throw error;
    }
  }

  let estadoInicial = "borrador";
  let fechaInicioUsoFinal = fechaInicioUso;
  let fechaFinUsoFinal = fechaFinUso;

  if (esPlantilla) {
    estadoInicial = "plantilla";
  } else if (cliente && marcarComoActiva) {
    estadoInicial = "activa";
    if (!fechaInicioUsoFinal) {
      fechaInicioUsoFinal = new Date();
    }
  }

  try {
    const nuevaRutina = await Rutina.create({
      entrenadorId,
      clienteId: cliente ? cliente._id : null,
      nombre,
      descripcion,
      objetivo,
      nivel,
      tipoSplit,
      diasPorSemana,
      semanasTotales,
      dias,
      esPlantilla: !!esPlantilla,
      estado: estadoInicial,
      etiquetas,
      fechaInicioUso: fechaInicioUsoFinal,
      fechaFinUso: fechaFinUsoFinal,
    });

    if (cliente && marcarComoActiva) {
      cliente.rutinaActiva = nuevaRutina._id;
      cliente.historialRutinas = cliente.historialRutinas || [];

      const yaEnHistorial = cliente.historialRutinas.some(
        (rId) => rId.toString() === nuevaRutina._id.toString()
      );

      if (!yaEnHistorial) {
        cliente.historialRutinas.push(nuevaRutina._id);
      }

      await cliente.save();
    }

    return nuevaRutina;
  } catch (error) {
    if (error.message && error.message.includes("Semana")) {
      error.statusCode = 400;
    }
    throw error;
  }
};

const listarRutinas = async (entrenadorId, query = {}) => {
  const { clienteId, estado, esPlantilla } = query;

  const filtro = {
    entrenadorId,
    eliminado: false,
  };

  if (clienteId) {
    filtro.clienteId = clienteId;
  }

  if (estado) {
    filtro.estado = estado;
  }

  if (esPlantilla === "true") {
    filtro.esPlantilla = true;
  } else if (esPlantilla === "false") {
    filtro.esPlantilla = false;
  }

  const rutinas = await Rutina.find(filtro)
    .select(
      "nombre descripcion objetivo nivel tipoSplit diasPorSemana semanasTotales estado esPlantilla etiquetas clienteId fechaInicioUso fechaFinUso createdAt"
    )
    .populate("clienteId", "nombre nombreMostrar estado")
    .sort({ createdAt: -1 })
    .lean();

  return rutinas;
};

const obtenerRutinaPorId = async (entrenadorId, id) => {
  const rutina = await Rutina.findOne({
    _id: id,
    entrenadorId,
    eliminado: false,
  }).populate("clienteId", "nombre nombreMostrar estado");

  if (!rutina) {
    const error = new Error("Rutina no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return rutina;
};

const actualizarRutina = async (entrenadorId, id, data) => {
  const datos = filtrarCampos(data, camposPermitidosActualizar);

  try {
    const rutina = await Rutina.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      datos,
      { new: true, runValidators: true }
    );

    if (!rutina) {
      const error = new Error("Rutina no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return rutina;
  } catch (error) {
    if (error.message && error.message.includes("Semana")) {
      error.statusCode = 400;
    }
    throw error;
  }
};

const archivarRutina = async (entrenadorId, id) => {
  const rutina = await Rutina.findOneAndUpdate(
    { _id: id, entrenadorId, eliminado: false },
    {
      estado: "archivada",
      eliminado: true,
      fechaFinUso: new Date(),
    },
    { new: true }
  );

  if (!rutina) {
    const error = new Error("Rutina no encontrada");
    error.statusCode = 404;
    throw error;
  }

  if (rutina.clienteId) {
    const cliente = await Cliente.findOne({
      _id: rutina.clienteId,
      entrenadores: entrenadorId,
    });

    if (
      cliente &&
      cliente.rutinaActiva &&
      cliente.rutinaActiva.toString() === id
    ) {
      cliente.rutinaActiva = null;
      await cliente.save();
    }
  }

  return rutina;
};

const asignarRutinaACliente = async (entrenadorId, rutinaId, clienteId) => {
  const rutina = await Rutina.findOne({
    _id: rutinaId,
    entrenadorId,
    eliminado: false,
  });

  if (!rutina) {
    const error = new Error("Rutina no encontrada para este entrenador");
    error.statusCode = 404;
    throw error;
  }

  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    const error = new Error("Cliente no encontrado para este entrenador");
    error.statusCode = 404;
    throw error;
  }

  cliente.rutinaActiva = rutina._id;

  if (!cliente.historialRutinas) {
    cliente.historialRutinas = [];
  }

  const yaEnHistorial = cliente.historialRutinas.some(
    (rId) => rId.toString() === rutina._id.toString()
  );

  if (!yaEnHistorial) {
    cliente.historialRutinas.push(rutina._id);
  }

  await cliente.save();

  return { cliente, rutina };
};

const quitarRutinaActivaDeCliente = async (entrenadorId, clienteId) => {
  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    const error = new Error("Cliente no encontrado para este entrenador");
    error.statusCode = 404;
    throw error;
  }

  cliente.rutinaActiva = null;
  await cliente.save();

  return cliente;
};

module.exports = {
  crearRutina,
  listarRutinas,
  obtenerRutinaPorId,
  actualizarRutina,
  archivarRutina,
  asignarRutinaACliente,
  quitarRutinaActivaDeCliente,
};
