const express = require("express");
const router = express.Router();

const {
  registrarEntrenador,
  loginEntrenador,
} = require("./authController");


router.post("/registrar", registrarEntrenador);


router.post("/login", loginEntrenador);

module.exports = router;
