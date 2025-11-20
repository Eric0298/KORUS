const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const{
   crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  archivarCliente, 
}= require("../controllers/clienteController");
router.use(verificarToken);
router.post("/",crearCliente);
router.get("/",listarClientes);
router.get("/:id", obtenerCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", archivarCliente);
module.exports= router;
