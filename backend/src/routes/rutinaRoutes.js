const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const validarObjectId = require("../middleware/validarObjectId");

const {
  crearRutina,
  listarRutinas,
  obtenerRutina,
  actualizarRutina,
  archivarRutina,
  asignarRutinaACliente,
  quitarRutinaActivaDeCliente,
} = require("../controllers/rutinaController");

router.use(verificarToken);

router.post("/", crearRutina);
router.get("/", listarRutinas);

router.get("/:id", validarObjectId("id"), obtenerRutina);
router.put("/:id", validarObjectId("id"), actualizarRutina);
router.delete("/:id", validarObjectId("id"), archivarRutina);

router.post(
  "/:rutinaId/asignar/:clienteId",
  validarObjectId("rutinaId"),
  validarObjectId("clienteId"),
  asignarRutinaACliente
);

router.post(
  "/quitar-de-cliente/:clienteId",
  validarObjectId("clienteId"),
  quitarRutinaActivaDeCliente
);

module.exports = router;
