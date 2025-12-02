const logger = require("../logger");

module.exports = (req, res, next) => {
  const inicio = Date.now();

  logger.info(`→ ${req.method} ${req.originalUrl}`, {
    entrenador: req.entrenador ? req.entrenador._id : null,
    ip: req.ip
  });

  res.on("finish", () => {
    const ms = Date.now() - inicio;

    logger.info(`← ${req.method} ${req.originalUrl} ${res.statusCode}`, {
      duracionMs: ms
    });
  });

  next();
};