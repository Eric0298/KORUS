const entrenadorService = require("../entrenadores/entrenadorService");
const { enviarRespuestaOk } = require("../../comun/infraestructura/response");

const registrarEntrenador = async (req, res, next) => {
  try {
    const entrenador = await entrenadorService.registrarEntrenador(req.body);

    return enviarRespuestaOk(res, {
      statusCode: 201,
      mensaje: "Entrenador registrado correctamente",
      body: { entrenador },
    });
  } catch (error) {
    console.error("Error en registrarEntrenador:", error);
    next(error);
  }
};

const loginEntrenador = async (req, res, next) => {
  try {
    const { token, entrenador } = await entrenadorService.loginEntrenador(
      req.body
    );

    return enviarRespuestaOk(res, {
      mensaje: "Login correcto",
      body: { token, entrenador },
    });
  } catch (error) {
    console.error("Error en loginEntrenador:", error);
    next(error);
  }
};

module.exports = {
  registrarEntrenador,
  loginEntrenador,
};