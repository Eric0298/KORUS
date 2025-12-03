/**
 * Enviar respuesta de éxito normalizada
 * @param {Response} res
 * @param {Object} opciones
 * @param {number} [opciones.statusCode=200]
 * @param {string} [opciones.mensaje="OK"]
 * @param {Object} [opciones.body={}] - datos extra a mezclar en la respuesta
 */
const enviarRespuestaOk = (res, { statusCode = 200, mensaje = "OK", body = {} } = {}) => {
  return res.status(statusCode).json({
    ok: true,
    mensaje,
    ...body, 
  });
};

module.exports = {
  enviarRespuestaOk,
};