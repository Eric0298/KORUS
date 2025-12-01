const Entrenador = require("../entrenadores/Entrenador");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registrarEntrenador = async(req, res)=>{
    try {
        const {nombre,correo,contrasena,telefono}=req.body;
        if (!nombre) {
      return res.status(400).json({ mensaje: "El nombre es obligatorio" });
    }

    if (!correo) {
      return res.status(400).json({ mensaje: "El correo es obligatorio" });
    }

    if (!contrasena) {
      return res.status(400).json({ mensaje: "La contraseña es obligatoria" });
    }
    if (contrasena.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres",
      });
    }
     const existente = await Entrenador.findOne({ correo });
    if (existente) {
      return res.status(400).json({
        mensaje: "Ya hay un entrenador registrado con este correo",
      });
    }
    const hash = await bcrypt.hash(contrasena, 10);
    const entrenador = await Entrenador.create({
        nombre,
        correo,
        contrasena:hash,
        telefono: telefono|| null,
    });
    return res.status(201).json({
      mensaje: "Entrenador registrado correctamente",
      entrenador: {
        id: entrenador._id,
        nombre: entrenador.nombre,
        correo: entrenador.correo,
        telefono: entrenador.telefono,
        rol: entrenador.rol,
        plan: entrenador.plan,
      },
    });
    } catch (error) {
        console.error("Error en registrarEntrenador:", error);
         return res.status(500).json({
      mensaje: "Error en el servidor al registrar",
      error: error.message,
    });
    }
};

const loginEntrenador = async(req, res)=>{
  try {
    const {correo, contrasena} = req.body
    if(!correo){
      return res.status(400).json({mensaje: "El correo es obligatorio"});
    }
    if(!contrasena){
      return res.status(400).json({mensaje: "La contraseña es obligatoria"})
    }
    const entrenador = await Entrenador.findOne({correo});
    if(!entrenador){
      return res.status(404).json({
        mensaje:"No existe ningún entrenador con ese correo",
      });
    }
    const esCorrecta = await bcrypt.compare(contrasena, entrenador.contrasena);
    if(!esCorrecta){
      return res.status(400).json({mensaje: "Contraseña incorrecta"})
    }
    entrenador.ultimoAcceso = new Date();
    await entrenador.save();
    const token = jwt.sign(
      {id:entrenador._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );
    return res.json({
      mensaje: "Login correcto",
      token,
      entrenador:{
        id: entrenador._id,
        nombre: entrenador.nombre,
        correo:entrenador.correo,
        telefono: entrenador.telefono,
        rol:entrenador.rol,
        plan: entrenador.plan
      },
    });
  } catch (error) {
    console.error("Error en el loginEntrenador: ", error);
    return res.status(500).json({
      mensaje: "Error en el servidor al iniciar sesión",
      error:error.message,
    });
  }
};
module.exports={
  registrarEntrenador,
  loginEntrenador,
}