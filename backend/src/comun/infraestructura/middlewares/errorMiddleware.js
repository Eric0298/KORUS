const notFound = (req, res, next)=>{
    res.status(404).json({
        mensaje: "Ruta no encontrada",
        ruta: req.originalUrl,
    });
};
const errorHandler = (err, req, res, next)=>{
    console.error("Error global:", err);
    const statusCode = err.statusCode || 500;
   res.status(statusCode).json({
    mensaje: err.message||"Error interno del servidor",
    error: process.env.NODE_ENV === "production"? undefined : err.message,
   });
};
module.exports ={
    notFound, 
    errorHandler,
};