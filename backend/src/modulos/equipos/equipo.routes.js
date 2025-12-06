// src/modulos/equipos/equipoRoutes.js

const express = require("express");
const router = express.Router();

const verificarToken = require("../../comun/infraestructura/middlewares/authMiddleware");
const validarObjectId = require("../../comun/infraestructura/middlewares/validarObjectId");

const {
  crearEquipo,
  listarEquipos,
  obtenerEquipo,

  agregarMiembro,
  listarMiembros,
  eliminarMiembro,
  actualizarEstadoMiembro,
  actualizarPosicionMiembro,

  obtenerPosicionesPorDeporte,

  generarRutinasFisicas,
  obtenerCalendarioMiembro,
} = require("./equipo.controller");

router.post("/", crearEquipo);

router.get("/", listarEquipos);

router.get(
  "/:equipoId",
  validarObjectId("equipoId"),
  obtenerEquipo
);


router.get("/posiciones/:deporte", obtenerPosicionesPorDeporte);

router.post(
  "/:equipoId/miembros",
  validarObjectId("equipoId"),
  agregarMiembro
);


router.get(
  "/:equipoId/miembros",
  validarObjectId("equipoId"),
  listarMiembros
);

router.delete(
  "/:equipoId/miembros/:miembroId",
  validarObjectId("equipoId"),
  validarObjectId("miembroId"),
  eliminarMiembro
);

router.patch(
  "/miembros/:miembroId/estado",
  validarObjectId("miembroId"),
  actualizarEstadoMiembro
);

router.patch(
  "/miembros/:miembroId/posicion",
  validarObjectId("miembroId"),
  actualizarPosicionMiembro
);

router.post(
  "/:equipoId/rutinas/generar-fisicas",
  validarObjectId("equipoId"),
  generarRutinasFisicas
);

router.get(
  "/:equipoId/miembros/:miembroId/calendario",
  validarObjectId("equipoId"),
  validarObjectId("miembroId"),
  obtenerCalendarioMiembro
);

module.exports = router;
