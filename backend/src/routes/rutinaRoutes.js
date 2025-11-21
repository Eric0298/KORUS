const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const {
  crearRutina,
  listarRutinas,
  obtenerRutina,
  actualizarRutina,
  archivarRutina,
} = require("../controllers/rutinaController");

router.use(verificarToken);

router.post("/", crearRutina);

router.get("/", listarRutinas);

router.get("/:id", obtenerRutina);

router.put("/:id", actualizarRutina);

router.delete("/:id", archivarRutina);

module.exports = router;
