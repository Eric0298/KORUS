const Ejercicio = require("../models/Ejercicio");
const crearEjercicio = async(req, res)=>{
    try {
        const entrenadorId = req.entrenador._id;
        const {
           nombre,
      grupoMuscular,
      descripcion,
      equipoNecesario,
      videoUrl,
      etiquetas,
        }=req.body
        if(!nombre){
            return res.status(400).json({
                mensaje: "El nombre del ejercicio es obligatorio",
            });
        }
        const nuevoEjercicio = await Ejercicio.create({
      entrenadorId,
      nombre,
      grupoMuscular,
      descripcion,
      equipoNecesario,
      videoUrl,
      etiquetas,
    });
    return res.status(201).json({
      mensaje: "Ejercicio creado correctamente",
      ejercicio: nuevoEjercicio,
    });
    } catch (error) {
        console.error("Error en crearEjercicio:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al crear el ejercicio",
      error: error.message,
    });
    }
};
const listarEjercicios = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { grupoMuscular, etiqueta } = req.query;

    const filtro = {
      entrenadorId,
      eliminado: false,
    };

    if (grupoMuscular) filtro.grupoMuscular = grupoMuscular;
    if (etiqueta) filtro.etiquetas = etiqueta;

    const ejercicios = await Ejercicio.find(filtro)
      .sort({ nombre: 1 })
      .lean();

    return res.json({
      mensaje: "Listado de ejercicios",
      ejercicios,
    });
  } catch (error) {
    console.error("Error en listarEjercicios:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al listar ejercicios",
      error: error.message,
    });
  }
};
const obtenerEjercicio = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const ejercicio = await Ejercicio.findOne({
      _id: id,
      entrenadorId,
      eliminado: false,
    });

    if (!ejercicio) {
      return res.status(404).json({
        mensaje: "Ejercicio no encontrado",
      });
    }

    return res.json({
      mensaje: "Ejercicio encontrado",
      ejercicio,
    });
  } catch (error) {
    console.error("Error en obtenerEjercicio:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al obtener el ejercicio",
      error: error.message,
    });
  }
};
const actualizarEjercicio = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;
    const datosActualizados = req.body;

    const ejercicio = await Ejercicio.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!ejercicio) {
      return res.status(404).json({
        mensaje: "Ejercicio no encontrado",
      });
    }

    return res.json({
      mensaje: "Ejercicio actualizado correctamente",
      ejercicio,
    });
  } catch (error) {
    console.error("Error en actualizarEjercicio:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al actualizar el ejercicio",
      error: error.message,
    });
  }
};
const archivarEjercicio = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const ejercicio = await Ejercicio.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      { eliminado: true },
      { new: true }
    );

    if (!ejercicio) {
      return res.status(404).json({
        mensaje: "Ejercicio no encontrado",
      });
    }

    return res.json({
      mensaje: "Ejercicio archivado correctamente",
      ejercicio,
    });
  } catch (error) {
    console.error("Error en archivarEjercicio:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al archivar el ejercicio",
      error: error.message,
    });
  }
};

module.exports = {
  crearEjercicio,
  listarEjercicios,
  obtenerEjercicio,
  actualizarEjercicio,
  archivarEjercicio,
};
