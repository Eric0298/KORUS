const Rutina = require("./Rutina");
const Cliente = require("../clientes/Cliente");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const parseSort = require("../../comun/utils/parseSort");
const ApiError = require("../../comun/core/ApiError");

const CAMPOS_PERMITIDOS_ACTUALIZAR = [
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
    throw new ApiError(400, "El nombre de la rutina es obligatorio");
  }

  let cliente = null;

  if (clienteId) {
    cliente = await Cliente.findOne({
      _id: clienteId,
      entrenadores: entrenadorId, 
      eliminado: false,
    });

    if (!cliente) {
      throw new ApiError(
        404,
        "Cliente no encontrado o no pertenece al entrenador autenticado"
      );
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
      throw new ApiError(400, error.message);
    }
    throw error;
  }
};

const listarRutinas = async (entrenadorId, query = {}) => {
  const { clienteId, estado, esPlantilla, page, limit, search, sort } = query;

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

  // 🔍 BÚSQUEDA POR TEXTO
  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filtro.$or = [
      { nombre: regex },
      { descripcion: regex },
      { objetivo: regex },
      { nivel: regex },
      { tipoSplit: regex },
      { etiquetas: regex },
    ];
  }

  // ORDENACIÓN (por defecto createdAt desc)
  const sortOption = parseSort(
    sort,
    ["nombre", "createdAt", "objetivo", "nivel", "estado"],
    { createdAt: -1 }
  );

  // --- PAGINACIÓN OPCIONAL ---
  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);
  const usarPaginacion = !isNaN(pageNum) && !isNaN(limitNum);

  if (!usarPaginacion) {
    const rutinas = await Rutina.find(filtro)
      .select(
        "nombre descripcion objetivo nivel tipoSplit diasPorSemana semanasTotales estado esPlantilla etiquetas clienteId fechaInicioUso fechaFinUso createdAt"
      )
      .populate("clienteId", "nombre nombreMostrar estado")
      .sort(sortOption)
      .lean();

    return {
      rutinas,
      paginacion: null,
    };
  }

  const skip = (pageNum - 1) * limitNum;

  const [rutinas, total] = await Promise.all([
    Rutina.find(filtro)
      .select(
        "nombre descripcion objetivo nivel tipoSplit diasPorSemana semanasTotales estado esPlantilla etiquetas clienteId fechaInicioUso fechaFinUso createdAt"
      )
      .populate("clienteId", "nombre nombreMostrar estado")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Rutina.countDocuments(filtro),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    rutinas,
    paginacion: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const obtenerRutinaPorId = async (entrenadorId, id) => {
  const rutina = await Rutina.findOne({
    _id: id,
    entrenadorId,
    eliminado: false,
  }).populate("clienteId", "nombre nombreMostrar estado");

  if (!rutina) {
    throw new ApiError(404, "Rutina no encontrada");
  }

  return rutina;
};

const actualizarRutina = async (entrenadorId, id, data) => {
  const datos = filtrarCampos(data, CAMPOS_PERMITIDOS_ACTUALIZAR);

  try {
    const rutina = await Rutina.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      datos,
      { new: true, runValidators: true }
    );

    if (!rutina) {
      throw new ApiError(404, "Rutina no encontrada");
    }

    return rutina;
  } catch (error) {
    if (error.message && error.message.includes("Semana")) {
      throw new ApiError(400, error.message);
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
    throw new ApiError(404, "Rutina no encontrada");
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
    throw new ApiError(404, "Rutina no encontrada para este entrenador");
  }

  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    throw new ApiError(404, "Cliente no encontrado para este entrenador");
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
    throw new ApiError(404, "Cliente no encontrado para este entrenador");
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