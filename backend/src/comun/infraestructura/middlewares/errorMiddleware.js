const notFound = (req, res, next) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("Error global:", err);

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    mensaje: err.message || "Error interno del servidor",
    // En producción no damos detalles internos
    error: isProd ? undefined : err.message,
    ruta: isProd ? undefined : req.originalUrl,
    metodo: isProd ? undefined : req.method,
    stack: isProd ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
