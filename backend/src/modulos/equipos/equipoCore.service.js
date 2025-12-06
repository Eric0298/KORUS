const Equipo = require("./equipo.model");
const EquipoMiembro = require("./equipoMiembro.model");
const Cliente = require("../clientes/Cliente");
const ApiError = require("../../comun/core/ApiError");
const parseSort = require("../../comun/utils/parseSort");
const POSICIONES_POR_DEPORTE = require("./posicionesPorDeporte");

const validarPosicionParaDeporte = (deporte, posicion) => {
  if (!posicion) return;

  const deporteKey = String(deporte || "").toLowerCase();
  const posiciones = POSICIONES_POR_DEPORTE[deporteKey];

  if (!posiciones || !Array.isArray(posiciones)) return;

  const posicionLower = String(posicion).toLowerCase();
  const esValida = posiciones.some(
    (p) => p.toLowerCase() === posicionLower
  );

  if (!esValida) {
    throw new ApiError(
      400,
      `La posición "${posicion}" no es válida para el deporte "${deporte}". ` +
        `Posiciones permitidas: ${posiciones.join(", ")}`
    );
  }
};

const validarEstadoYLesion = (estado, lesion) => {
  if (!estado) return;

  if (estado === "activo") return;

  if (estado === "lesionado" || estado === "rehabilitacion") {
    if (!lesion || !lesion.parteCuerpo || !lesion.tipoLesion) {
      throw new ApiError(
        400,
        'Para estado "lesionado" o "rehabilitacion" debes indicar al menos `parteCuerpo` y `tipoLesion` en `lesion`.'
      );
    }
  }
};

const obtenerEquipoDeEntrenador = async (entrenadorId, equipoId) => {
  const equipo = await Equipo.findOne({
    _id: equipoId,
    entrenador: entrenadorId,
  });

  if (!equipo) {
    throw new ApiError(404, "Equipo no encontrado");
  }

  return equipo;
};


const crearEquipo = async (entrenadorId, datos) => {
  const { nombre, deporte, descripcion } = datos;

  if (!nombre) throw new ApiError(400, "El nombre del equipo es obligatorio");
  if (!deporte) throw new ApiError(400, "El deporte del equipo es obligatorio");

  const nuevoEquipo = await Equipo.create({
    nombre,
    deporte,
    descripcion: descripcion || null,
    entrenador: entrenadorId,
  });

  return nuevoEquipo;
};

const listarEquipos = async (entrenadorId, opciones = {}) => {
  const { activo, search, sort } = opciones;

  const filtro = { entrenador: entrenadorId };

  if (typeof activo !== "undefined") {
    if (activo === "true" || activo === true) filtro.activo = true;
    if (activo === "false" || activo === false) filtro.activo = false;
  }

  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filtro.$or = [
      { nombre: regex },
      { deporte: regex },
      { descripcion: regex },
    ];
  }

  const sortOption = parseSort(
    sort,
    ["nombre", "deporte", "createdAt"],
    { createdAt: -1 }
  );

  const equipos = await Equipo.find(filtro).sort(sortOption);
  return equipos;
};

const obtenerEquipoPorId = async (entrenadorId, equipoId, opciones = {}) => {
  const { incluirMiembros = false } = opciones;

  let query = Equipo.findOne({
    _id: equipoId,
    entrenador: entrenadorId,
  });

  if (incluirMiembros) {
    query = query.populate({
      path: "miembros",
      populate: {
        path: "cliente",
        select:
          "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal",
      },
    });
  }

  const equipo = await query.exec();

  if (!equipo) {
    throw new ApiError(404, "Equipo no encontrado");
  }

  return equipo;
};


const agregarMiembroAEquipo = async (entrenadorId, equipoId, datosMiembro) => {
  const {
    clienteId,
    alturaCm,
    pesoKg,
    lateralidad,
    porcentajeGrasa,
    posicion,
    esCapitan,
    estado,
    lesion,
    notas,
  } = datosMiembro;

  if (!clienteId) {
    throw new ApiError(400, "El clienteId es obligatorio");
  }

  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    throw new ApiError(
      404,
      "Cliente no encontrado o no asociado a este entrenador"
    );
  }

  validarPosicionParaDeporte(equipo.deporte, posicion);
  validarEstadoYLesion(estado, lesion);

  let miembro;
  try {
    miembro = await EquipoMiembro.create({
      equipo: equipo._id,
      cliente: cliente._id,
      alturaCm,
      pesoKg,
      lateralidad,
      porcentajeGrasa,
      posicion,
      esCapitan: !!esCapitan,
      estado: estado || "activo",
      lesion,
      notas,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Este cliente ya forma parte de este equipo");
    }
    throw err;
  }

  equipo.miembros.push(miembro._id);
  await equipo.save();

  const miembroConCliente = await EquipoMiembro.findById(miembro._id)
    .populate(
      "cliente",
      "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal"
    )
    .exec();

  return miembroConCliente;
};

const listarMiembrosDeEquipo = async (entrenadorId, equipoId) => {
  await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const miembros = await EquipoMiembro.find({
    equipo: equipoId,
    fechaBaja: { $exists: false },
  })
    .populate(
      "cliente",
      "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal"
    )
    .exec();

  return miembros;
};

const eliminarMiembroDeEquipo = async (entrenadorId, equipoId, miembroId) => {
  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const miembro = await EquipoMiembro.findById(miembroId);
  if (!miembro) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo) !== String(equipo._id)) {
    throw new ApiError(400, "El miembro no pertenece a este equipo");
  }

  miembro.fechaBaja = new Date();
  await miembro.save();

  await Equipo.findByIdAndUpdate(equipo._id, {
    $pull: { miembros: miembro._id },
  });

  return { success: true };
};

const actualizarEstadoMiembro = async (entrenadorId, miembroId, datos) => {
  const { estado, lesion } = datos;

  const miembro = await EquipoMiembro.findById(miembroId).populate("equipo");
  if (!miembro) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo.entrenador) !== String(entrenadorId)) {
    throw new ApiError(403, "No tienes permisos sobre este miembro");
  }

  validarEstadoYLesion(estado, lesion);

  if (estado) miembro.estado = estado;

  if (miembro.estado === "activo") {
    miembro.lesion = undefined;
  } else if (
    miembro.estado === "lesionado" ||
    miembro.estado === "rehabilitacion"
  ) {
    miembro.lesion = lesion;
  }

  await miembro.save();
  return miembro;
};

const actualizarPosicionMiembro = async (entrenadorId, miembroId, datos) => {
  const { posicion } = datos;
  if (!posicion) {
    throw new ApiError(400, "La posición es obligatoria");
  }

  const miembro = await EquipoMiembro.findById(miembroId).populate("equipo");
  if (!miembro) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo.entrenador) !== String(entrenadorId)) {
    throw new ApiError(403, "No tienes permisos sobre este miembro");
  }

  validarPosicionParaDeporte(miembro.equipo.deporte, posicion);

  miembro.posicion = posicion;
  await miembro.save();

  return miembro;
};

const obtenerPosicionesPorDeporte = (deporte) => {
  const key = String(deporte || "").toLowerCase();
  return POSICIONES_POR_DEPORTE[key] || [];
};

module.exports = {
  // helpers compartidos
  obtenerEquipoDeEntrenador,

  // equipos
  crearEquipo,
  listarEquipos,
  obtenerEquipoPorId,

  agregarMiembroAEquipo,
  listarMiembrosDeEquipo,
  eliminarMiembroDeEquipo,
  actualizarEstadoMiembro,
  actualizarPosicionMiembro,

  obtenerPosicionesPorDeporte,
};
