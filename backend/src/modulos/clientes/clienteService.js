const Cliente = require("./Cliente");
const filtrarCampos = require("../../utils/filtrarCampos");
const parseSort = require("../../comun/utils/parseSort");

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

const listarClientes = async (entrenadorId, opciones = {}) => {
  const { estado, page, limit, search, sort } = opciones;

  const filtro = {
    entrenadores: entrenadorId,
    eliminado: false,
  };

  // Filtro por estado
  if (estado) {
    filtro.estado = estado;
  } else {
    filtro.estado = { $ne: "archivado" };
  }

  // BÚSQUEDA POR TEXTO (nombre, apellidos, nombreMostrar, correo, telefono)
  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i"); // i = case-insensitive
    filtro.$or = [
      { nombre: regex },
      { apellidos: regex },
      { nombreMostrar: regex },
      { correo: regex },
      { telefono: regex },
    ];
  }

  // ORDENACIÓN
  const sortOption = parseSort(
    sort,
    ["nombreMostrar", "createdAt", "objetivoPrincipal", "estado"],
    { createdAt: -1 } // por defecto: más recientes primero
  );

  // --- PAGINACIÓN OPCIONAL ---
  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);

  const usarPaginacion = !isNaN(pageNum) && !isNaN(limitNum);

  if (!usarPaginacion) {
    const clientes = await Cliente.find(filtro).sort(sortOption);
    return {
      clientes,
      paginacion: null,
    };
  }

  const skip = (pageNum - 1) * limitNum;

  const [clientes, total] = await Promise.all([
    Cliente.find(filtro).sort(sortOption).skip(skip).limit(limitNum),
    Cliente.countDocuments(filtro),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    clientes,
    paginacion: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
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