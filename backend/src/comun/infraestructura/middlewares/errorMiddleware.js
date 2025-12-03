const notFound = (req, res, next) => {
  res.status(404).json({
    ok: false,
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("Error global:", err);

  const isProd = process.env.NODE_ENV === "production";

  let statusCode = err.statusCode || 500;
  let mensaje = err.message || "Error interno del servidor";
  let detalles = undefined;

  // Errores de validación de Mongoose (enum, required, min/max, etc.)
  if (err.name === "ValidationError") {
    statusCode = 400;
    mensaje = "Datos no válidos";

    if (!isProd) {
      detalles = Object.values(err.errors || {}).map((e) => ({
        campo: e.path,
        tipo: e.kind,
        mensaje: e.message,
        valor: e.value,
      }));
    }
  }

  //IDs de Mongo mal formados
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    mensaje = "ID no válido";
  }

  res.status(statusCode).json({
    ok: false,
    mensaje,
    error: isProd ? undefined : err.message,
    detalles: isProd ? undefined : detalles,
    ruta: isProd ? undefined : req.originalUrl,
    metodo: isProd ? undefined : req.method,
    stack: isProd ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};