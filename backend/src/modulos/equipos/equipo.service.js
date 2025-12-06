const core = require("./equipoCore.service");
const rutinas = require("./equipoRutina.service");

module.exports = {
  ...core,
  ...rutinas,
};
