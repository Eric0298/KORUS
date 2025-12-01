const jwt = require("jsonwebtoken");
const Entrenador = require("../../../modulos/entrenadores/Entrenador");
const verificarToken = async(req, res, next)=>{
    try{
        if(!process.env.JWT_SECRET){
            console.error("Falta JWT_SECRET en las variables de entorno");
            return res.status(500).json({
                mensaje: "Configuración de servidor incompleta(JWT)",
            });
        }

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({mensaje: "Token no proporcionado"});
        }
        const token = authHeader.split(" ")[1];

        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            if(err.name === "TokenExpiredError"){
                return res.status(401).json({mensaje:"Token expirado"});
            }
            return res.status(401).json({mensaje: "Token inválido"});
        }
        const entrenador = await Entrenador.findById(decoded.id).select(
            "-contrasena"
        );
        if(!entrenador){
            return res.status(404).json({mensaje: "Entrenador no encontrado"});
        }
        if(entrenador.estado !== "activo"){
            return res.status(403).json({
                mensaje: "Cuenta suspendida o inactiva",
            });
        }
        req.entrenador = entrenador;
        next();
    }catch(error){
        console.error("Error en verificarToken: ", error);
        return res.status(500).json({mensaje: "Error en la autenticación", error: error.message});
    }
};
module.exports = verificarToken;