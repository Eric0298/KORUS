const express = require("express");
const router = express.Router();
const verificarToken = require("../../comun/infraestructura/middlewares/authMiddleware");
const validarObjectId = require("../../comun/infraestructura/middlewares/validarObjectId");
const{
   crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  archivarCliente, 
}= require("./clienteController");
router.use(verificarToken);
router.post("/", crearCliente);
router.get("/", listarClientes);

router.get("/:id", validarObjectId("id"), obtenerCliente);
router.put("/:id", validarObjectId("id"), actualizarCliente);
router.delete("/:id", validarObjectId("id"), archivarCliente);

module.exports= router;
