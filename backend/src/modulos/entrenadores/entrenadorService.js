const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Entrenador = require("./Entrenador");
const ApiError = require("../../comun/core/ApiError");

const limpiarEntrenador = (entrenador) => {
  if (!entrenador) return null;

  return {
    id: entrenador._id,
    nombre: entrenador.nombre,
    correo: entrenador.correo,
    telefono: entrenador.telefono || null,
    rol: entrenador.rol,
    plan: entrenador.plan,
  };
};

const validarCamposRegistro = ({ nombre, correo, contrasena }) => {
  if (!nombre) {
    throw new ApiError(400, "El nombre es obligatorio");
  }
  if (!correo) {
    throw new ApiError(400, "El correo es obligatorio");
  }
  if (!contrasena) {
    throw new ApiError(400, "La contraseña es obligatoria");
  }
  if (contrasena.length < 6) {
    throw new ApiError(400, "La contraseña debe tener al menos 6 caracteres");
  }
};

const registrarEntrenador = async ({ nombre, correo, contrasena, telefono }) => {
  validarCamposRegistro({ nombre, correo, contrasena });

  const existente = await Entrenador.findOne({ correo });
  if (existente) {
    throw new ApiError(
      400,
      "Ya hay un entrenador registrado con este correo"
    );
  }

  const hash = await bcrypt.hash(contrasena, 10);

  const entrenador = await Entrenador.create({
    nombre,
    correo,
    contrasena: hash,
    telefono: telefono || null,
  });

  return limpiarEntrenador(entrenador);
};

const loginEntrenador = async ({ correo, contrasena }) => {
  if (!correo) {
    throw new ApiError(400, "El correo es obligatorio");
  }
  if (!contrasena) {
    throw new ApiError(400, "La contraseña es obligatoria");
  }

  const entrenador = await Entrenador.findOne({ correo });

  if (!entrenador) {
    throw new ApiError(
      404,
      "No existe ningún entrenador con ese correo"
    );
  }

  if (entrenador.estado !== "activo") {
    throw new ApiError(403, "Cuenta suspendida o inactiva");
  }

  const esCorrecta = await bcrypt.compare(contrasena, entrenador.contrasena);
  if (!esCorrecta) {
    throw new ApiError(400, "Contraseña incorrecta");
  }

  entrenador.ultimoAcceso = new Date();
  await entrenador.save();

  if (!process.env.JWT_SECRET) {
    throw new ApiError(
      500,
      "Configuración de servidor incompleta (JWT)"
    );
  }

  const token = jwt.sign(
    { id: entrenador._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    entrenador: limpiarEntrenador(entrenador),
  };
};

module.exports = {
  registrarEntrenador,
  loginEntrenador,
};