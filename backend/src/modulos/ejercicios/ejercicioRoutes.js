const express = require("express");
const router = express.Router();

const verificarToken = require("../../comun/infraestructura/middlewares/authMiddleware");
const validarObjectId = require("../../comun/infraestructura/middlewares/validarObjectId");

const {
  crearEjercicio,
  listarEjercicios,
  obtenerEjercicio,
  actualizarEjercicio,
  archivarEjercicio,
} = require("./ejercicioController");

router.use(verificarToken);

router.post("/", crearEjercicio);
router.get("/", listarEjercicios);

router.get("/:id", validarObjectId("id"), obtenerEjercicio);
router.put("/:id", validarObjectId("id"), actualizarEjercicio);
router.delete("/:id", validarObjectId("id"), archivarEjercicio);

module.exports = router;