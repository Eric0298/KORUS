const equipoService = require("./equipo.service");
const ApiError = require("../../comun/core/ApiError");
const { enviarRespuestaOk } = require("../../comun/infraestructura/response");

const crearEquipo = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const equipo = await equipoService.crearEquipo(entrenadorId, req.body);

    return enviarRespuestaOk(res, {
      statusCode: 201,
      mensaje: "Equipo creado correctamente",
      body: { equipo },
    });
  } catch (error) {
    next(error);
  }
};

const listarEquipos = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { activo, search, sort } = req.query;

    const equipos = await equipoService.listarEquipos(entrenadorId, {
      activo,
      search,
      sort,
    });

    return enviarRespuestaOk(res, {
      mensaje: "Listado de equipos",
      body: { equipos },
    });
  } catch (error) {
    next(error);
  }
};

const obtenerEquipo = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId } = req.params;
    const { incluirMiembros } = req.query;

    const equipo = await equipoService.obtenerEquipoPorId(entrenadorId, equipoId, {
      incluirMiembros: incluirMiembros === "true",
    });

    return enviarRespuestaOk(res, {
      mensaje: "Equipo encontrado",
      body: { equipo },
    });
  } catch (error) {
    next(error);
  }
};

const agregarMiembro = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId } = req.params;

    const miembro = await equipoService.agregarMiembroAEquipo(
      entrenadorId,
      equipoId,
      req.body
    );

    return enviarRespuestaOk(res, {
      statusCode: 201,
      mensaje: "Miembro añadido al equipo correctamente",
      body: { miembro },
    });
  } catch (error) {
    next(error);
  }
};

const listarMiembros = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId } = req.params;
    const { estado, search, sort, page, limit } = req.query;

    const { miembros, paginacion } = await equipoService.listarMiembrosDeEquipo(
      entrenadorId,
      equipoId,
      { estado, search, sort, page, limit }
    );

    return enviarRespuestaOk(res, {
      mensaje: "Listado de miembros del equipo",
      body: { miembros, paginacion },
    });
  } catch (error) {
    next(error);
  }
};

const eliminarMiembro = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId, miembroId } = req.params;

    await equipoService.eliminarMiembroDeEquipo(entrenadorId, equipoId, miembroId);

    return enviarRespuestaOk(res, {
      mensaje: "Miembro eliminado del equipo",
    });
  } catch (error) {
    next(error);
  }
};

const actualizarEstadoMiembro = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { miembroId } = req.params;

    const miembroActualizado = await equipoService.actualizarEstadoMiembro(
      entrenadorId,
      miembroId,
      req.body
    );

    return enviarRespuestaOk(res, {
      mensaje: "Estado del miembro actualizado correctamente",
      body: { miembro: miembroActualizado },
    });
  } catch (error) {
    next(error);
  }
};

const actualizarPosicionMiembro = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { miembroId } = req.params;

    const miembroActualizado = await equipoService.actualizarPosicionMiembro(
      entrenadorId,
      miembroId,
      req.body
    );

    return enviarRespuestaOk(res, {
      mensaje: "Posición del miembro actualizada correctamente",
      body: { miembro: miembroActualizado },
    });
  } catch (error) {
    next(error);
  }
};

const generarRutinasFisicas = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId } = req.params;

    const resultado = await equipoService.generarRutinasFisicasParaEquipo(
      entrenadorId,
      equipoId,
      req.body
    );

    return enviarRespuestaOk(res, {
      mensaje: "Rutinas físicas generadas para el equipo",
      body: resultado,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerCalendarioMiembro = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { equipoId, miembroId } = req.params;

    const calendario = await equipoService.obtenerCalendarioMiembroEquipo(
      entrenadorId,
      equipoId,
      miembroId
    );

    return enviarRespuestaOk(res, {
      mensaje: "Calendario de rutinas del miembro de equipo",
      body: calendario,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerPosicionesPorDeporte = async (req, res, next) => {
  try {
    const { deporte } = req.query;

    if (!deporte) {
      throw new ApiError(400, "El parámetro 'deporte' es obligatorio");
    }

    const posiciones = await equipoService.obtenerPosicionesPorDeporte(deporte);

    return enviarRespuestaOk(res, {
      mensaje: "Posiciones del deporte",
      body: { deporte, posiciones },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearEquipo,
  listarEquipos,
  obtenerEquipo,
  agregarMiembro,
  listarMiembros,
  eliminarMiembro,
  actualizarEstadoMiembro,
  actualizarPosicionMiembro,
  generarRutinasFisicas,
  obtenerCalendarioMiembro,
  obtenerPosicionesPorDeporte,
};
