const entrenadorService = require("../entrenadores/entrenadorService");

const registrarEntrenador = async (req, res, next) => {
  try {
    const { nombre, correo, contrasena, telefono } = req.body;

    const entrenadorData = await entrenadorService.registrarEntrenador({
      nombre,
      correo,
      contrasena,
      telefono,
    });

    return res.status(201).json({
      mensaje: "Entrenador registrado correctamente",
      entrenador: entrenadorData,
    });
  } catch (error) {
    console.error("Error en registrarEntrenador:", error);
    next(error);
  }
};

const loginEntrenador = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    const { token, entrenador } = await entrenadorService.loginEntrenador({
      correo,
      contrasena,
    });

    return res.json({
      mensaje: "Login correcto",
      token,
      entrenador,
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
