const ejercicioService = require("./ejercicioService");

const crearEjercicio = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const nuevoEjercicio = await ejercicioService.crearEjercicio(
      entrenadorId,
      req.body
    );

    return res.status(201).json({
      mensaje: "Ejercicio creado correctamente",
      ejercicio: nuevoEjercicio,
    });
  } catch (error) {
    console.error("Error en crearEjercicio:", error);
    next(error);
  }
};

const listarEjercicios = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { grupoMuscular, etiqueta, page, limit, search, sort } = req.query;

    const { ejercicios, paginacion } = await ejercicioService.listarEjercicios(
      entrenadorId,
      { grupoMuscular, etiqueta, page, limit, search, sort }
    );

    return res.json({
      mensaje: "Listado de ejercicios",
      ejercicios,
      paginacion,
    });
  } catch (error) {
    console.error("Error en listarEjercicios:", error);
    next(error);
  }
};

const obtenerEjercicio = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const ejercicio = await ejercicioService.obtenerEjercicioPorId(
      entrenadorId,
      id
    );

    return res.json({
      mensaje: "Ejercicio encontrado",
      ejercicio,
    });
  } catch (error) {
    console.error("Error en obtenerEjercicio:", error);
    next(error);
  }
};

const actualizarEjercicio = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const ejercicioActualizado = await ejercicioService.actualizarEjercicio(
      entrenadorId,
      id,
      req.body
    );

    return res.json({
      mensaje: "Ejercicio actualizado correctamente",
      ejercicio: ejercicioActualizado,
    });
  } catch (error) {
    console.error("Error en actualizarEjercicio:", error);
    next(error);
  }
};

const archivarEjercicio = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const ejercicioArchivado = await ejercicioService.archivarEjercicio(
      entrenadorId,
      id
    );

    return res.json({
      mensaje: "Ejercicio archivado correctamente",
      ejercicio: ejercicioArchivado,
    });
  } catch (error) {
    console.error("Error en archivarEjercicio:", error);
    next(error);
  }
};

module.exports = {
  crearEjercicio,
  listarEjercicios,
  obtenerEjercicio,
  actualizarEjercicio,
  archivarEjercicio,
};
