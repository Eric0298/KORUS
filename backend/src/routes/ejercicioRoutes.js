const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
  crearEjercicio,
  listarEjercicios,
  obtenerEjercicio,
  actualizarEjercicio,
  archivarEjercicio,
} = require("../controllers/ejercicioController");

router.use(verificarToken);

router.post("/", crearEjercicio);       
router.get("/", listarEjercicios);      
router.get("/:id", obtenerEjercicio);   
router.put("/:id", actualizarEjercicio);
router.delete("/:id", archivarEjercicio); 

module.exports = router;