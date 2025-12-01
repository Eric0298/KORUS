const rutinaService = require("./rutinaService");

const crearRutina = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const nuevaRutina = await rutinaService.crearRutina(entrenadorId, req.body);

    return res.status(201).json({
      mensaje: "Rutina creado correctamente",
      rutina: nuevaRutina,
    });
  } catch (error) {
    console.error("Error en crearRutina:", error);
    next(error);
  }
};

const listarRutinas = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const rutinas = await rutinaService.listarRutinas(entrenadorId, req.query);

    return res.json({
      mensaje: "Listado de rutinas",
      rutinas,
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

    return res.json({
      mensaje: "Rutina encontrada",
      rutina,
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

    const rutinaActualizada = await rutinaService.actualizarRutina(
      entrenadorId,
      id,
      req.body
    );

    return res.json({
      mensaje: "Rutina actualizada correctamente",
      rutina: rutinaActualizada,
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

    return res.json({
      mensaje: "Rutina archivada correctamente",
      rutina: rutinaArchivada,
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

    return res.json({
      mensaje: "Rutina asignada como activa al cliente",
      cliente,
      rutina,
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

    return res.json({
      mensaje: "Rutina activa eliminada del cliente",
      cliente,
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
