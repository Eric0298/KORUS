const rutinaService = require("./rutinaService");
const { enviarRespuestaOk } = require("../../comun/infraestructura/response");

const crearRutina = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const nuevaRutina = await rutinaService.crearRutina(
      entrenadorId,
      req.body
    );

    return enviarRespuestaOk(res, {
      statusCode: 201,
      mensaje: "Rutina creada correctamente",
      body: { rutina: nuevaRutina },
    });
  } catch (error) {
    console.error("Error en crearRutina:", error);
    next(error);
  }
};

const listarRutinas = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { clienteId, estado, esPlantilla, page, limit, search, sort } =
      req.query;

    const { rutinas, paginacion } = await rutinaService.listarRutinas(
      entrenadorId,
      { clienteId, estado, esPlantilla, page, limit, search, sort }
    );

    return enviarRespuestaOk(res, {
      mensaje: "Listado de rutinas",
      body: { rutinas, paginacion },
    });
  } catch (error) {
    console.error("Error en listarRutinas:", error);
    next(error);
  }
};

const obtenerRutina = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const rutina = await rutinaService.obtenerRutinaPorId(entrenadorId, id);

    return enviarRespuestaOk(res, {
      mensaje: "Rutina encontrada",
      body: { rutina },
    });
  } catch (error) {
    console.error("Error en obtenerRutina:", error);
    next(error);
  }
};

const actualizarRutina = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;
    const datos = req.body;

    const rutinaActualizada = await rutinaService.actualizarRutina(
      entrenadorId,
      id,
      datos
    );

    return enviarRespuestaOk(res, {
      mensaje: "Rutina actualizada correctamente",
      body: { rutina: rutinaActualizada },
    });
  } catch (error) {
    console.error("Error en actualizarRutina:", error);
    next(error);
  }
};

const archivarRutina = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const rutinaArchivada = await rutinaService.archivarRutina(
      entrenadorId,
      id
    );

    return enviarRespuestaOk(res, {
      mensaje: "Rutina archivada correctamente",
      body: { rutina: rutinaArchivada },
    });
  } catch (error) {
    console.error("Error en archivarRutina:", error);
    next(error);
  }
};

const asignarRutinaACliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { rutinaId, clienteId } = req.params;

    const { cliente, rutina } = await rutinaService.asignarRutinaACliente(
      entrenadorId,
      rutinaId,
      clienteId
    );

    return enviarRespuestaOk(res, {
      mensaje: "Rutina asignada correctamente al cliente",
      body: { cliente, rutina },
    });
  } catch (error) {
    console.error("Error en asignarRutinaACliente:", error);
    next(error);
  }
};

const quitarRutinaActivaDeCliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { clienteId } = req.params;

    const cliente = await rutinaService.quitarRutinaActivaDeCliente(
      entrenadorId,
      clienteId
    );

    return enviarRespuestaOk(res, {
      mensaje: "Rutina activa eliminada del cliente",
      body: { cliente },
    });
  } catch (error) {
    console.error("Error en quitarRutinaActivaDeCliente:", error);
    next(error);
  }
};

module.exports = {
  crearRutina,
  listarRutinas,
  obtenerRutina,
  actualizarRutina,
  archivarRutina,
  asignarRutinaACliente,
  quitarRutinaActivaDeCliente,
};