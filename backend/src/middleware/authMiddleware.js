const jwt = require("jsonwebtoken");
const Entrenador = require("../models/Entrenador");
const verificarToken = async(req, res, next)=>{
    try {
        const authHeader= req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer ")){
            return res.status(401).json({mensaje: "Token no proporcionado"});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const entrenador = await Entrenador.findById(decoded.id).select(".contrasena");
        if(!entrenador){
            return res.status(404).json({mensaje: "Entrenador no encontrado" });
        }
        if(entrenador.estado !=="activo"){
            return res.status(403).json({mensaje: "Cuenta suspendida o inactiva"});
        }
        req.entrenador = entrenador;
        next();
    } catch (error) {
        console.error("Error en verificarToken: ", error);
        return res.status(401).json({mensaje: "Token invalido o expirado"});
    }
};
module.exports = verificarToken;