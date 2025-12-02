/**
 * Convierte un string sort tipo:
 *  "nombre"       -> { nombre: 1 }
 *  "-createdAt"   -> { createdAt: -1 }
 *  "nombre,-estado" -> { nombre: 1, estado: -1 }
 *
 * @param {string} sortString - cadena recibida por query (?sort=...)
 * @param {string[]} camposPermitidos - lista blanca de campos ordenables
 * @param {object} defaultSort - objeto sort por defecto (ej: { createdAt: -1 })
 * @returns {object} objeto sort para Mongoose
 */
function parseSort(sortString, camposPermitidos, defaultSort) {
  if (!sortString) return defaultSort;

  const partes = sortString
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (!partes.length) return defaultSort;

  const sortObj = {};

  for (const parte of partes) {
    let direction = 1;
    let campo = parte;

    if (parte.startsWith("-")) {
      direction = -1;
      campo = parte.slice(1);
    }

    if (camposPermitidos.includes(campo)) {
      sortObj[campo] = direction;
    }
  }

  // Si después de filtrar no queda nada válido , usamos el default
  if (Object.keys(sortObj).length === 0) {
    return defaultSort;
  }

  return sortObj;
}

module.exports = parseSort;