const Cliente = require("./Cliente");
const filtrarCampos = require("../../utils/filtrarCampos");

// Campos permitidos al crear un cliente
const camposPermitidosCrear = [
  "nombre",
  "apellidos",
  "nombreMostrar",
  "correo",
  "telefono",
  "fechaNacimiento",
  "sexo",
  "fotoPerfilUrl",
  "objetivoPrincipal",
  "objetivoSecundario",
  "descripcionObjetivos",
  "nivelGeneral",
  "experienciaDeportiva",
  "estado",
  "notas",
  "pesoInicialKg",
  "pesoActualKg",
  "alturaCm",
  "porcentajeGrasa",
  "frecuenciaCardiacaReposo",
  "preferencias",
  "etiquetas",
];

const camposPermitidosActualizar = [
  "nombre",
  "apellidos",
  "nombreMostrar",
  "correo",
  "telefono",
  "fechaNacimiento",
  "sexo",
  "fotoPerfilUrl",
  "objetivoPrincipal",
  "objetivoSecundario",
  "descripcionObjetivos",
  "nivelGeneral",
  "experienciaDeportiva",
  "estado",
  "notas",
  "pesoInicialKg",
  "pesoActualKg",
  "alturaCm",
  "porcentajeGrasa",
  "frecuenciaCardiacaReposo",
  "preferencias",
  "etiquetas",
];

// Crear cliente: añadimos al entrenador que lo crea
const crearCliente = async (entrenadorId, data) => {
  const datos = filtrarCampos(data, camposPermitidosCrear);

  if (!datos.nombre) {
    const error = new Error("El nombre del cliente es obligatorio");
    error.statusCode = 400;
    throw error;
  }

  const nuevoCliente = await Cliente.create({
    entrenadores: [entrenadorId], // 👈 aquí
    ...datos,
  });

  return nuevoCliente;
};

const listarClientes = async (entrenadorId, estadoQuery) => {
  const filtro = {
    entrenadores: entrenadorId, // 👈 array que contiene ese entrenador
    eliminado: false,
  };

  if (estadoQuery) {
    filtro.estado = estadoQuery;
  } else {
    filtro.estado = { $ne: "archivado" };
  }

  const clientes = await Cliente.find(filtro).sort({ createdAt: -1 });
  return clientes;
};

const obtenerClientePorId = async (entrenadorId, id) => {
  const cliente = await Cliente.findOne({
    _id: id,
    entrenadores: entrenadorId, // 👈
    eliminado: false,
  });

  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return cliente;
};

const actualizarCliente = async (entrenadorId, id, data) => {
  const datos = filtrarCampos(data, camposPermitidosActualizar);

  const cliente = await Cliente.findOneAndUpdate(
    { _id: id, entrenadores: entrenadorId, eliminado: false }, // 👈
    datos,
    { new: true, runValidators: true }
  );

  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return cliente;
};

const archivarCliente = async (entrenadorId, id) => {
  const cliente = await Cliente.findOneAndUpdate(
    { _id: id, entrenadores: entrenadorId, eliminado: false }, // 👈
    {
      estado: "archivado",
      eliminado: true,
    },
    { new: true }
  );

  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }

  return cliente;
};

module.exports = {
  crearCliente,
  listarClientes,
  obtenerClientePorId,
  actualizarCliente,
  archivarCliente,
};