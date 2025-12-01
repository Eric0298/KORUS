const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Entrenador = require("./Entrenador");
const validarCamposRegistro = ({ nombre, correo, contrasena }) => {
  if (!nombre) {
    const error = new Error("El nombre es obligatorio");
    error.statusCode = 400;
    throw error;
  }
  if (!correo) {
    const error = new Error("El correo es obligatorio");
    error.statusCode = 400;
    throw error;
  }
  if (!contrasena) {
    const error = new Error("La contraseña es obligatoria");
    error.statusCode = 400;
    throw error;
  }
  if (contrasena.length < 6) {
    const error = new Error("La contraseña debe tener al menos 6 caracteres");
    error.statusCode = 400;
    throw error;
  }
};

const registrarEntrenador = async ({ nombre, correo, contrasena, telefono }) => {
  validarCamposRegistro({ nombre, correo, contrasena });

  const existente = await Entrenador.findOne({ correo });
  if (existente) {
    const error = new Error("Ya hay un entrenador registrado con este correo");
    error.statusCode = 400;
    throw error;
  }

  const hash = await bcrypt.hash(contrasena, 10);

  const entrenador = await Entrenador.create({
    nombre,
    correo,
    contrasena: hash,
    telefono: telefono || null,
  });

  return {
    id: entrenador._id,
    nombre: entrenador.nombre,
    correo: entrenador.correo,
    telefono: entrenador.telefono,
    rol: entrenador.rol,
    plan: entrenador.plan,
  };
};

const loginEntrenador = async ({ correo, contrasena }) => {
  if (!correo) {
    const error = new Error("El correo es obligatorio");
    error.statusCode = 400;
    throw error;
  }
  if (!contrasena) {
    const error = new Error("La contraseña es obligatoria");
    error.statusCode = 400;
    throw error;
  }

  const entrenador = await Entrenador.findOne({ correo });

  if (!entrenador) {
    const error = new Error("No existe ningún entrenador con ese correo");
    error.statusCode = 404;
    throw error;
  }

  const esCorrecta = await bcrypt.compare(contrasena, entrenador.contrasena);
  if (!esCorrecta) {
    const error = new Error("Contraseña incorrecta");
    error.statusCode = 400;
    throw error;
  }

  entrenador.ultimoAcceso = new Date();
  await entrenador.save();

  if (!process.env.JWT_SECRET) {
    const error = new Error("Configuración de servidor incompleta (JWT)");
    error.statusCode = 500;
    throw error;
  }

  const token = jwt.sign(
    { id: entrenador._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    entrenador: {
      id: entrenador._id,
      nombre: entrenador.nombre,
      correo: entrenador.correo,
      telefono: entrenador.telefono,
      rol: entrenador.rol,
      plan: entrenador.plan,
    },
  };
};

module.exports = {
  registrarEntrenador,
  loginEntrenador,
};