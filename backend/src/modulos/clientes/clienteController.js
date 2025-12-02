const clienteService = require("./clienteService");

const crearCliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;

    const nuevoCliente = await clienteService.crearCliente(
      entrenadorId,
      req.body
    );

    return res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente: nuevoCliente,
    });
  } catch (error) {
    console.error("Error en crearCliente:", error);
    next(error);
  }
};

const listarClientes = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { estado, page, limit, search, sort } = req.query;

    const { clientes, paginacion } = await clienteService.listarClientes(
      entrenadorId,
      { estado, page, limit, search, sort }
    );

    return res.json({
      mensaje: "Listado de clientes",
      clientes,
      paginacion,
    });
  } catch (error) {
    console.error("Error en listarClientes:", error);
    next(error);
  }
};

const obtenerCliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const cliente = await clienteService.obtenerClientePorId(
      entrenadorId,
      id
    );

    return res.json({
      mensaje: "Cliente encontrado",
      cliente,
    });
  } catch (error) {
    console.error("Error en obtenerCliente:", error);
    next(error);
  }
};

const actualizarCliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const clienteActualizado = await clienteService.actualizarCliente(
      entrenadorId,
      id,
      req.body
    );

    return res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteActualizado,
    });
  } catch (error) {
    console.error("Error en actualizarCliente:", error);
    next(error);
  }
};

const archivarCliente = async (req, res, next) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const clienteArchivado = await clienteService.archivarCliente(
      entrenadorId,
      id
    );

    return res.json({
      mensaje: "Cliente archivado correctamente",
      cliente: clienteArchivado,
    });
  } catch (error) {
    console.error("Error en archivarCliente:", error);
    next(error);
  }
};

module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  archivarCliente,
};
