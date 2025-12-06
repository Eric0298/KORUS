const Equipo = require("./Equipo");
const EquipoMiembro = require("./equipoMiembro.model");
const Cliente = require("../clientes/Cliente");
const ApiError = require("../../comun/core/ApiError");
const filtrarCampos = require("../../comun/utils/filtrarCampos");
const parseSort = require("../../comun/utils/parseSort");
const POSICIONES_POR_DEPORTE = require("./posicionesPorDeporte");

const CAMPOS_EQUIPO = ["nombre", "deporte", "descripcion", "activo"];

const crearEquipo = async (entrenadorId, datos) => {
  const data = filtrarCampos(datos, CAMPOS_EQUIPO);

  if (!data.nombre) {
    throw new ApiError(400, "El nombre del equipo es obligatorio");
  }

  if (!data.deporte) {
    throw new ApiError(400, "El deporte del equipo es obligatorio");
  }

  const equipo = await Equipo.create({
    ...data,
    entrenador: entrenadorId,
  });

  return equipo;
};

const listarEquipos = async (entrenadorId, opciones = {}) => {
  const { activo, search, sort } = opciones;

  const filtro = {
    entrenador: entrenadorId,
  };

  if (activo === "true") filtro.activo = true;
  if (activo === "false") filtro.activo = false;

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

  const equipos = await Equipo.find(filtro).sort(sortOption).lean();

  return equipos;
};

const obtenerEquipoDeEntrenador = async (entrenadorId, equipoId, opciones = {}) => {
  const { incluirMiembros = false } = opciones;

  const equipo = await Equipo.findOne({
    _id: equipoId,
    entrenador: entrenadorId,
  });

  if (!equipo) {
    throw new ApiError(404, "Equipo no encontrado para este entrenador");
  }

  if (incluirMiembros) {
    const miembros = await EquipoMiembro.find({
      equipo: equipo._id,
      fechaBaja: { $exists: false },
    })
      .populate(
        "cliente",
        "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal estado"
      )
      .lean();

    equipo._doc.miembros = miembros;
  }

  return equipo;
};

const obtenerEquipoPorId = async (entrenadorId, equipoId, opciones = {}) => {
  return obtenerEquipoDeEntrenador(entrenadorId, equipoId, opciones);
};

const validarPosicionParaDeporte = (deporte, posicion) => {
  const lista = POSICIONES_POR_DEPORTE[deporte] || [];
  if (!lista.length) return;
  if (!lista.includes(posicion)) {
    throw new ApiError(
      400,
      `La posición "${posicion}" no es válida para el deporte "${deporte}". Posiciones válidas: ${lista.join(
        ", "
      )}`
    );
  }
};

const agregarMiembroAEquipo = async (entrenadorId, equipoId, datos) => {
  const { clienteId, posicion, esCapitan, estado, lesion } = datos;

  if (!clienteId) {
    throw new ApiError(400, "clienteId es obligatorio");
  }

  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  if (equipo.activo === false) {
    throw new ApiError(400, "No se pueden añadir miembros a un equipo inactivo");
  }

  const cliente = await Cliente.findOne({
    _id: clienteId,
    entrenadores: entrenadorId,
    eliminado: false,
  });

  if (!cliente) {
    throw new ApiError(
      404,
      "Cliente no encontrado o no pertenece al entrenador autenticado"
    );
  }

  const yaMiembro = await EquipoMiembro.findOne({
    equipo: equipo._id,
    cliente: cliente._id,
    fechaBaja: { $exists: false },
  });

  if (yaMiembro) {
    throw new ApiError(
      400,
      "Este cliente ya es miembro activo de este equipo"
    );
  }

  if (posicion) {
    validarPosicionParaDeporte(equipo.deporte, posicion);
  }

  if (esCapitan) {
    const capitanExistente = await EquipoMiembro.findOne({
      equipo: equipo._id,
      esCapitan: true,
      fechaBaja: { $exists: false },
    });

    if (capitanExistente) {
      throw new ApiError(
        400,
        "Ya existe un capitán activo en este equipo. Desmarca esCapitan o cambia primero el capitán."
      );
    }
  }

  const estadoFinal = estado || "activo";
  let lesionFinal = null;

  if (estadoFinal === "lesionado" || estadoFinal === "rehabilitacion") {
    if (!lesion || !lesion.parteCuerpo || !lesion.tipoLesion) {
      throw new ApiError(
        400,
        "Para estado lesionado/rehabilitacion es obligatorio indicar parteCuerpo y tipoLesion"
      );
    }
    lesionFinal = lesion;
  }

  const miembro = await EquipoMiembro.create({
    equipo: equipo._id,
    cliente: cliente._id,
    alturaCm: datos.alturaCm,
    pesoKg: datos.pesoKg,
    porcentajeGrasa: datos.porcentajeGrasa,
    lateralidad: datos.lateralidad || "diestro",
    posicion: posicion || null,
    esCapitan: !!esCapitan,
    estado: estadoFinal,
    lesion: lesionFinal,
    notas: datos.notas || null,
    fechaAlta: new Date(),
  });

  await Equipo.updateOne(
    { _id: equipo._id },
    { $addToSet: { miembros: miembro._id } }
  );

  const miembroPopulado = await EquipoMiembro.findById(miembro._id).populate(
    "cliente",
    "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal estado"
  );

  return miembroPopulado;
};

const listarMiembrosDeEquipo = async (entrenadorId, equipoId, opciones = {}) => {
  const { estado, search, sort, page, limit } = opciones;

  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const filtro = {
    equipo: equipo._id,
    fechaBaja: { $exists: false },
  };

  if (estado) {
    filtro.estado = estado;
  }

  const sortOption = parseSort(
    sort,
    ["posicion", "fechaAlta", "createdAt", "estado", "esCapitan"],
    { esCapitan: -1, createdAt: 1 }
  );

  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);
  const usarPaginacion = !isNaN(pageNum) && !isNaN(limitNum);

  if (!usarPaginacion) {
    let miembros = await EquipoMiembro.find(filtro)
      .sort(sortOption)
      .populate(
        "cliente",
        "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal estado"
      )
      .lean();

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      miembros = miembros.filter((m) => {
        const c = m.cliente || {};
        return (
          regex.test(c.nombre || "") ||
          regex.test(c.apellidos || "") ||
          regex.test(c.nombreMostrar || "") ||
          regex.test(c.correo || "")
        );
      });
    }

    return {
      miembros,
      paginacion: null,
    };
  }

  const skip = (pageNum - 1) * limitNum;

  let miembros = await EquipoMiembro.find(filtro)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum)
    .populate(
      "cliente",
      "nombre apellidos nombreMostrar correo fotoPerfilUrl objetivoPrincipal estado"
    )
    .lean();

  const total = await EquipoMiembro.countDocuments(filtro);

  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    miembros = miembros.filter((m) => {
      const c = m.cliente || {};
      return (
        regex.test(c.nombre || "") ||
        regex.test(c.apellidos || "") ||
        regex.test(c.nombreMostrar || "") ||
        regex.test(c.correo || "")
      );
    });
  }

  const totalPages = Math.ceil(total / limitNum);

  return {
    miembros,
    paginacion: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const eliminarMiembroDeEquipo = async (entrenadorId, equipoId, miembroId) => {
  const equipo = await obtenerEquipoDeEntrenador(entrenadorId, equipoId);

  const miembro = await EquipoMiembro.findOne({
    _id: miembroId,
    equipo: equipo._id,
    fechaBaja: { $exists: false },
  });

  if (!miembro) {
    throw new ApiError(404, "Miembro de equipo no encontrado o ya dado de baja");
  }

  const ahora = new Date();
  if (miembro.fechaAlta && miembro.fechaAlta > ahora) {
    throw new ApiError(
      400,
      "La fecha de alta del miembro es posterior a la fecha actual. Revisa los datos."
    );
  }

  miembro.fechaBaja = ahora;
  await miembro.save();

  await Equipo.updateOne(
    { _id: equipo._id },
    { $pull: { miembros: miembro._id } }
  );

  return;
};

const actualizarEstadoMiembro = async (entrenadorId, miembroId, datos) => {
  const { estado, lesion } = datos;

  if (!estado) {
    throw new ApiError(400, "El estado es obligatorio");
  }

  const miembro = await EquipoMiembro.findById(miembroId).populate("equipo");

  if (!miembro || !miembro.equipo) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo.entrenador) !== String(entrenadorId)) {
    throw new ApiError(403, "No tienes permisos sobre este miembro");
  }

  miembro.estado = estado;

  if (estado === "activo") {
    miembro.lesion = null;
  } else if (estado === "lesionado" || estado === "rehabilitacion") {
    if (!lesion || !lesion.parteCuerpo || !lesion.tipoLesion) {
      throw new ApiError(
        400,
        "Para estado lesionado/rehabilitacion es obligatorio indicar parteCuerpo y tipoLesion"
      );
    }
    miembro.lesion = lesion;
  }

  const guardado = await miembro.save();

  return guardado;
};

const actualizarPosicionMiembro = async (entrenadorId, miembroId, datos) => {
  const { posicion } = datos;

  if (!posicion) {
    throw new ApiError(400, "La posición es obligatoria");
  }

  const miembro = await EquipoMiembro.findById(miembroId).populate("equipo");

  if (!miembro || !miembro.equipo) {
    throw new ApiError(404, "Miembro de equipo no encontrado");
  }

  if (String(miembro.equipo.entrenador) !== String(entrenadorId)) {
    throw new ApiError(403, "No tienes permisos sobre este miembro");
  }

  validarPosicionParaDeporte(miembro.equipo.deporte, posicion);

  miembro.posicion = posicion;
  const guardado = await miembro.save();

  return guardado;
};

const obtenerPosicionesPorDeporte = async (deporte) => {
  const posiciones = POSICIONES_POR_DEPORTE[deporte] || [];
  return posiciones;
};

module.exports = {
  crearEquipo,
  listarEquipos,
  obtenerEquipoPorId,
  obtenerEquipoDeEntrenador,
  agregarMiembroAEquipo,
  listarMiembrosDeEquipo,
  eliminarMiembroDeEquipo,
  actualizarEstadoMiembro,
  actualizarPosicionMiembro,
  obtenerPosicionesPorDeporte,
};
