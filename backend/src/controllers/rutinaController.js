const Rutina = require("../models/Rutina");
const Cliente = require("../models/Cliente");

const crearRutina = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;

    const {
      clienteId,
      nombre,
      descripcion,
      objetivo,
      nivel,
      tipoSplit,
      diasPorSemana,
      semanasTotales,
      dias,
      esPlantilla,
      etiquetas,
      fechaInicioUso,   
      fechaFinUso,
      marcarComoActiva, 
    } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ mensaje: "El nombre de la rutina es obligatorio" });
    }

    let cliente = null;

    if (clienteId) {
      cliente = await Cliente.findOne({
        _id: clienteId,
        entrenadorId,
        eliminado: false,
      });

      if (!cliente) {
        return res.status(404).json({
          mensaje:
            "Cliente no encontrado o no pertenece al entrenador autenticado",
        });
      }
    }

    let estadoInicial = "borrador";
    let fechaInicioUsoFinal = fechaInicioUso;
    let fechaFinUsoFinal = fechaFinUso;

    if (esPlantilla) {
      estadoInicial = "plantilla";
    } else if (cliente && marcarComoActiva) {
      estadoInicial = "activa";
      if (!fechaInicioUsoFinal) {
        fechaInicioUsoFinal = new Date();
      }
    }

    const nuevaRutina = await Rutina.create({
      entrenadorId,
      clienteId: cliente ? cliente._id : null,
      nombre,
      descripcion,
      objetivo,
      nivel,
      tipoSplit,
      diasPorSemana,
      semanasTotales,
      dias,
      esPlantilla: !!esPlantilla,
      estado: estadoInicial,
      etiquetas,
      fechaInicioUso: fechaInicioUsoFinal,
      fechaFinUso: fechaFinUsoFinal,
    });

    if (cliente && marcarComoActiva) {
      cliente.rutinaActiva = nuevaRutina._id;
      cliente.historialRutinas = cliente.historialRutinas || [];
      cliente.historialRutinas.push(nuevaRutina._id);
      await cliente.save();
    }

    return res.status(201).json({
      mensaje: "Rutina creada correctamente",
      rutina: nuevaRutina,
    });
  } catch (error) {
    console.error("Error en crearRutina:", error);

    // Si viene del pre("save") por semanas fuera de rango
    if (error.message && error.message.includes("Semana")) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error en el servidor al crear la rutina",
      error: error.message,
    });
  }
};

const listarRutinas = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { clienteId, estado, esPlantilla } = req.query;

    const filtro = {
      entrenadorId,
      eliminado: false,
    };

    if (clienteId) {
      filtro.clienteId = clienteId;
    }

    if (estado) {
      filtro.estado = estado;
    }

    if (esPlantilla === "true") {
      filtro.esPlantilla = true;
    } else if (esPlantilla === "false") {
      filtro.esPlantilla = false;
    }

    const rutinas = await Rutina.find(filtro)
      .select(
        "nombre descripcion objetivo nivel tipoSplit diasPorSemana semanasTotales estado esPlantilla etiquetas clienteId fechaInicioUso fechaFinUso createdAt"
      )
      .populate("clienteId", "nombre nombreMostrar estado")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      mensaje: "Listado de rutinas",
      rutinas,
    });
  } catch (error) {
    console.error("Error en listarRutinas:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al listar rutinas",
      error: error.message,
    });
  }
};


const obtenerRutina = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const rutina = await Rutina.findOne({
      _id: id,
      entrenadorId,
      eliminado: false,
    }).populate("clienteId", "nombre nombreMostrar estado");

    if (!rutina) {
      return res.status(404).json({
        mensaje: "Rutina no encontrada",
      });
    }

    return res.json({
      mensaje: "Rutina encontrada",
      rutina,
    });
  } catch (error) {
    console.error("Error en obtenerRutina:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al obtener la rutina",
      error: error.message,
    });
  }
};

const actualizarRutina = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;
    const datosActualizados = req.body;

    const rutina = await Rutina.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!rutina) {
      return res.status(404).json({
        mensaje: "Rutina no encontrada",
      });
    }

    return res.json({
      mensaje: "Rutina actualizada correctamente",
      rutina,
    });
  } catch (error) {
    console.error("Error en actualizarRutina:", error);

    if (error.message && error.message.includes("Semana")) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error en el servidor al actualizar la rutina",
      error: error.message,
    });
  }
};

const archivarRutina = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const rutina = await Rutina.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      {
        estado: "archivada",
        eliminado: true,
        fechaFinUso: new Date(),
      },
      { new: true }
    );

    if (!rutina) {
      return res.status(404).json({
        mensaje: "Rutina no encontrada",
      });
    }

    if (rutina.clienteId) {
      const cliente = await Cliente.findOne({
        _id: rutina.clienteId,
        entrenadorId,
      });

      if (
        cliente &&
        cliente.rutinaActiva &&
        cliente.rutinaActiva.toString() === id
      ) {
        cliente.rutinaActiva = null;
        await cliente.save();
      }
    }

    return res.json({
      mensaje: "Rutina archivada correctamente",
      rutina,
    });
  } catch (error) {
    console.error("Error en archivarRutina:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al archivar la rutina",
      error: error.message,
    });
  }
};
const asignarRutinaACliente = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { rutinaId, clienteId } = req.params;

    const rutina = await Rutina.findOne({
      _id: rutinaId,
      entrenadorId,
      eliminado: false,
    });

    if (!rutina) {
      return res.status(404).json({
        mensaje: "Rutina no encontrada para este entrenador",
      });
    }

    const cliente = await Cliente.findOne({
      _id: clienteId,
      entrenadorId,
      eliminado: false,
    });

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado para este entrenador",
      });
    }

    cliente.rutinaActiva = rutina._id;

    if (!cliente.historialRutinas) {
      cliente.historialRutinas = [];
    }

    const yaEnHistorial = cliente.historialRutinas.some(
      (rId) => rId.toString() === rutina._id.toString()
    );

    if (!yaEnHistorial) {
      cliente.historialRutinas.push(rutina._id);
    }

    await cliente.save();

    return res.json({
      mensaje: "Rutina asignada como activa al cliente",
      cliente,
      rutina,
    });
  } catch (error) {
    console.error("Error en asignarRutinaACliente:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al asignar la rutina",
      error: error.message,
    });
  }
};


const quitarRutinaActivaDeCliente = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { clienteId } = req.params;

    const cliente = await Cliente.findOne({
      _id: clienteId,
      entrenadorId,
      eliminado: false,
    });

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado para este entrenador",
      });
    }

    cliente.rutinaActiva = null;
    await cliente.save();

    return res.json({
      mensaje: "Rutina activa eliminada del cliente",
      cliente,
    });
  } catch (error) {
    console.error("Error en quitarRutinaActivaDeCliente:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al quitar la rutina activa",
      error: error.message,
    });
  }
};

module.exports = {
  crearRutina,
  listarRutinas,
  obtenerRutina,
  actualizarRutina,
  archivarRutina,
  asignarRutinaACliente,
  quitarRutinaActivaDeCliente,

};
