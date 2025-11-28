const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const validarObjectId = require("../middleware/validarObjectId");
const{
   crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  archivarCliente, 
}= require("../controllers/clienteController");
router.use(verificarToken);
router.post("/", crearCliente);
router.get("/", listarClientes);

router.get("/:id", validarObjectId("id"), obtenerCliente);
router.put("/:id", validarObjectId("id"), actualizarCliente);
router.delete("/:id", validarObjectId("id"), archivarCliente);

module.exports= router;
