const rutinaService = require("./rutinaService");
const { enviarRespuestaOk } = require("../../comun/infraestructura/response");

const crearEjercicio = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const nuevoEjercicio = await ejercicioService.crearEjercicio(
      entrenadorId,
      req.body
    );

    return enviarRespuestaOk(res, {
      statusCode: 201,
      mensaje: "Ejercicio creado correctamente",
      body: { ejercicio: nuevoEjercicio },
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

    return enviarRespuestaOk(res, {
      mensaje: "Listado de ejercicios",
      body: { ejercicios, paginacion },
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

    return enviarRespuestaOk(res, {
      mensaje: "Ejercicio encontrado",
      body: { ejercicio },
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
    const datos = req.body;

    const ejercicioActualizado = await ejercicioService.actualizarEjercicio(
      entrenadorId,
      id,
      datos
    );

    return enviarRespuestaOk(res, {
      mensaje: "Ejercicio actualizado correctamente",
      body: { ejercicio: ejercicioActualizado },
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

    return enviarRespuestaOk(res, {
      mensaje: "Ejercicio archivado correctamente",
      body: { ejercicio: ejercicioArchivado },
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