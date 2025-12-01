const Ejercicio = require("./Ejercicio");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const camposPermitidosCrear = [
  "nombre",
  "grupoMuscular",
  "descripcion",
  "equipoNecesario",
  "videoUrl",
  "etiquetas",
];

const camposPermitidosActualizar = [
  "nombre",
  "grupoMuscular",
  "descripcion",
  "equipoNecesario",
  "videoUrl",
  "etiquetas",
];

const crearEjercicio = async (entrenadorId, data) => {
  const datos = filtrarCampos(data, camposPermitidosCrear);

  if (!datos.nombre) {
    const error = new Error("El nombre del ejercicio es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const nuevoEjercicio = await Ejercicio.create({
    entrenadorId,
    ...datos,
  });

  return nuevoEjercicio;
};

const listarEjercicios = async (entrenadorId, filtros = {}) => {
  const { grupoMuscular, etiqueta } = filtros;

  const filtro = {
    entrenadorId,
    eliminado: false,
  };

  if (grupoMuscular) filtro.grupoMuscular = grupoMuscular;
  if (etiqueta) filtro.etiquetas = etiqueta;

  const ejercicios = await Ejercicio.find(filtro).sort({ nombre: 1 }).lean();
  return ejercicios;
};

const obtenerEjercicioPorId = async (entrenadorId, id) => {
  const ejercicio = await Ejercicio.findOne({
    _id: id,
    entrenadorId,
    eliminado: false,
  });

  if (!ejercicio) {
    const error = new Error("Ejercicio no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return ejercicio;
};

const actualizarEjercicio = async (entrenadorId, id, data) => {
  const datos = filtrarCampos(data, camposPermitidosActualizar);

  const ejercicio = await Ejercicio.findOneAndUpdate(
    { _id: id, entrenadorId, eliminado: false },
    datos,
    { new: true, runValidators: true }
  );

  if (!ejercicio) {
    const error = new Error("Ejercicio no encontrado");
    error.statusCode = 404;
    throw error;
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
    const error = new Error("Ejercicio no encontrado");
    error.statusCode = 404;
    throw error;
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