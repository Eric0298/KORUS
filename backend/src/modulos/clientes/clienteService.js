const Cliente = require("./Cliente");
const ApiError = require("../../comun/core/ApiError");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const parseSort = require("../../comun/utils/parseSort");

// Campos permitidos para crear/actualizar un cliente
const CAMPOS_PERMITIDOS = [
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
  "rutinaActiva",
  "historialRutinas",
];

// Crear cliente
const crearCliente = async (entrenadorId, datos) => {
  const datosFiltrados = filtrarCampos(datos, CAMPOS_PERMITIDOS);

  if (!datosFiltrados.nombre) {
    throw new ApiError(400, "El nombre del cliente es obligatorio");
  }

  // Aseguramos que el entrenador creador queda asociado en la relación N:M
  const entrenadores = [entrenadorId];

  const nuevoCliente = await Cliente.create({
    ...datosFiltrados,
    entrenadores,
  });

  return nuevoCliente;
};

//  Listar clientes (paginación + search + sort)
const listarClientes = async (entrenadorId, opciones = {}) => {
  const { estado, page, limit, search, sort } = opciones;

  const filtro = {
    entrenadores: entrenadorId,
    eliminado: false,
  };

  // Filtro estado
  if (estado) {
    filtro.estado = estado;
  } else {
    filtro.estado = { $ne: "archivado" };
  }

  // Búsqueda de texto
  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filtro.$or = [
      { nombre: regex },
      { apellidos: regex },
      { nombreMostrar: regex },
      { correo: regex },
      { telefono: regex },
    ];
  }

  // Ordenación
  const sortOption = parseSort(
    sort,
    ["nombreMostrar", "createdAt", "objetivoPrincipal", "estado"],
    { createdAt: -1 }
  );

  // Paginación opcional
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

// Obtener cliente por id (validando relación con entrenador)
const obtenerClientePorId = async (entrenadorId, clienteId) => {
  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    throw new ApiError(404, "Cliente no encontrado");
  }

  return cliente;
};

// Actualizar cliente (solo campos permitidos)
const actualizarCliente = async (entrenadorId, clienteId, datos) => {
  const datosFiltrados = filtrarCampos(datos, CAMPOS_PERMITIDOS);

  const clienteActualizado = await Cliente.findOneAndUpdate(
    {
      _id: clienteId,
      entrenadores: entrenadorId,
      eliminado: false,
    },
    datosFiltrados,
    { new: true, runValidators: true }
  );

  if (!clienteActualizado) {
    throw new ApiError(404, "Cliente no encontrado");
  }

  return clienteActualizado;
};

// Soft delete / archivo
const archivarCliente = async (entrenadorId, clienteId) => {
  const clienteArchivado = await Cliente.findOneAndUpdate(
    {
      _id: clienteId,
      entrenadores: entrenadorId,
      eliminado: false,
    },
    {
      estado: "archivado",
      eliminado: true,
    },
    { new: true }
  );

  if (!clienteArchivado) {
    throw new ApiError(404, "Cliente no encontrado");
  }

  return clienteArchivado;
};

module.exports = {
  crearCliente,
  listarClientes,
  obtenerClientePorId,
  actualizarCliente,
  archivarCliente,
};
