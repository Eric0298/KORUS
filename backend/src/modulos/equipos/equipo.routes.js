const express = require("express");
const router = express.Router();
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
  generarRutinasFisicas,
  obtenerCalendarioMiembro,
  obtenerPosicionesPorDeporte,
} = require("./equipo.controller");


router.get("/posiciones/deporte", obtenerPosicionesPorDeporte);

router.post("/", crearEquipo);
router.get("/", listarEquipos);

router.get("/:equipoId", validarObjectId("equipoId"), obtenerEquipo);

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
  "/:equipoId/miembros/:miembroId/estado",
  validarObjectId("equipoId"),
  validarObjectId("miembroId"),
  actualizarEstadoMiembro
);

router.patch(
  "/:equipoId/miembros/:miembroId/posicion",
  validarObjectId("equipoId"),
  validarObjectId("miembroId"),
  actualizarPosicionMiembro
);

router.post(
  "/:equipoId/rutinas/fisicas/generar",
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
