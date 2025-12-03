const Ejercicio = require("./Ejercicio");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const parseSort = require("../../comun/utils/parseSort");
const ApiError = require("../../comun/core/ApiError");

const CAMPOS_PERMITIDOS = [
  "nombre",
  "grupoMuscular",
  "descripcion",
  "equipoNecesario",
  "videoUrl",
  "etiquetas",
];

const crearEjercicio = async (entrenadorId, data) => {
  const datos = filtrarCampos(data, CAMPOS_PERMITIDOS);

  if (!datos.nombre) {
    throw new ApiError(400, "El nombre del ejercicio es obligatorio");
  }

  const nuevoEjercicio = await Ejercicio.create({
    entrenadorId,
    ...datos,
  });

  return nuevoEjercicio;
};

const listarEjercicios = async (entrenadorId, filtros = {}) => {
  const { grupoMuscular, etiqueta, page, limit, search, sort } = filtros;

  const filtro = {
    entrenadorId,
    eliminado: false,
  };

  if (grupoMuscular) filtro.grupoMuscular = grupoMuscular;
  if (etiqueta) filtro.etiquetas = etiqueta;

  // BÚSQUEDA POR TEXTO (nombre, grupoMuscular, etiquetas)
  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filtro.$or = [
      { nombre: regex },
      { grupoMuscular: regex },
      { etiquetas: regex },
    ];
  }

  //  ORDENACIÓN (nombre asc por defecto)
  const sortOption = parseSort(
    sort,
    ["nombre", "grupoMuscular", "createdAt"],
    { nombre: 1 }
  );

  // --- PAGINACIÓN OPCIONAL ---
  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);

  const usarPaginacion = !isNaN(pageNum) && !isNaN(limitNum);

  if (!usarPaginacion) {
    const ejercicios = await Ejercicio.find(filtro).sort(sortOption).lean();
    return {
      ejercicios,
      paginacion: null,
    };
  }

  const skip = (pageNum - 1) * limitNum;

  const [ejercicios, total] = await Promise.all([
    Ejercicio.find(filtro)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Ejercicio.countDocuments(filtro),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    ejercicios,
    paginacion: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const obtenerEjercicioPorId = async (entrenadorId, id) => {
  const ejercicio = await Ejercicio.findOne({
    _id: id,
    entrenadorId,
    eliminado: false,
  });

  if (!ejercicio) {
    throw new ApiError(404, "Ejercicio no encontrado");
  }

  return ejercicio;
};

const actualizarEjercicio = async (entrenadorId, id, data) => {
  const datos = filtrarCampos(data, CAMPOS_PERMITIDOS);

  const ejercicio = await Ejercicio.findOneAndUpdate(
    { _id: id, entrenadorId, eliminado: false },
    datos,
    { new: true, runValidators: true }
  );

  if (!ejercicio) {
    throw new ApiError(404, "Ejercicio no encontrado");
  }

  return ejercicio;
};

const archivarEjercicio = async (entrenadorId, id) => {
  const ejercicio = await Ejercicio.findOneAndUpdate(
    { _id: id, entrenadorId, eliminado: false },
    { eliminado: true },
    { new: true }
  );

  if (!ejercicio) {
    throw new ApiError(404, "Ejercicio no encontrado");
  }

  return ejercicio;
};

module.exports = {
  crearEjercicio,
  listarEjercicios,
  obtenerEjercicioPorId,
  actualizarEjercicio,
  archivarEjercicio,
};