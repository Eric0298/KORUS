const Cliente = require("../models/Cliente");

const crearCliente = async (req, res)=>{
    try {
        const entrenadorId = req.entrenador._id
        const{
           nombre,
      apellidos,
      nombreMostrar,
      correo,
      telefono,
      fechaNacimiento,
      sexo,
      fotoPerfilUrl,
      objetivoPrincipal,
      objetivoSecundario,
      descripcionObjetivos,
      nivelGeneral,
      experienciaDeportiva,
      estado,
      notas,
      pesoInicialKg,
      pesoActualKg,
      alturaCm,
      porcentajeGrasa,
      frecuenciaCardiacaReposo,
      preferencias,
      etiquetas,  
        }=req.body;
        if(!nombre){
            return res.status(400).json({
                mensaje:"El nombre del cliente es obligatorio",
            });
        }
        const nuevoCliente = await Cliente.create({
      entrenadorId,
      nombre,
      apellidos,
      nombreMostrar,
      correo,
      telefono,
      fechaNacimiento,
      sexo,
      fotoPerfilUrl,
      objetivoPrincipal,
      objetivoSecundario,
      descripcionObjetivos,
      nivelGeneral,
      experienciaDeportiva,
      estado,
      notas,
      pesoInicialKg,
      pesoActualKg,
      alturaCm,
      porcentajeGrasa,
      frecuenciaCardiacaReposo,
      preferencias,
      etiquetas,
    });
    return res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente: nuevoCliente,
    });
    } catch (error) {
        console.error("Error en crearCliente:", error);
     return res.status(500).json({
      mensaje: "Error en el servidor al crear el cliente",
      error: error.message,
    });
    }
};
const listarClientes  = async (req,res)=>{
    try {
        const entrenadorId = req.entrenador._id;
        const {estado} = req.query;
        const filtro ={
            entrenadorId,
            eliminado: false,
        };
        if(estado){
            filtro.estado = estado;
        }else{
            filtro.estado = {$ne: "archivado"}
        }
        const clientes = await Cliente.find(filtro).sort({createdAt:-1});
        return res.json({
            mensaje: "Listado de clientes",
            clientes,
        });
    } catch (error) {
        console.error("Error en listarClientes:", error);
        return res.status(500).json({
            mensaje: "Error en el servidor al listar clientes",
            error: error.message,
        });
    }
};
const obtenerCliente = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const cliente = await Cliente.findOne({
      _id: id,
      entrenadorId,
      eliminado: false,
    });

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    return res.json({
      mensaje: "Cliente encontrado",
      cliente,
    });
  } catch (error) {
    console.error("Error en obtenerCliente:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al obtener el cliente",
      error: error.message,
    });
  }
};
const actualizarCliente = async (req, res) => {
  try{
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const datosActualizados = req.body;

    const cliente = await Cliente.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      datosActualizados,
      { new: true, runValidators: true }
    );

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    return res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente,
    });
  }catch (error) {
    console.error("Error en actualizarCliente:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al actualizar el cliente",
      error: error.message,
    });
  }
};
const archivarCliente = async (req, res) => {
  try {
    const entrenadorId = req.entrenador._id;
    const { id } = req.params;

    const cliente = await Cliente.findOneAndUpdate(
      { _id: id, entrenadorId, eliminado: false },
      {
        estado: "archivado",
        eliminado: true,
      },
      { new: true }
    );

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    return res.json({
      mensaje: "Cliente archivado correctamente",
      cliente,
    });
  } catch (error) {
    console.error("Error en archivarCliente:", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al archivar el cliente",
      error: error.message,
    });
  }
};
module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  archivarCliente,
};