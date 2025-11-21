const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const verificarToken = require("./middleware/authMiddleware");
const clienteRoutes = require("./routes/clienteRoutes");
const rutinaRoutes = require("./routes/rutinaRoutes");
const ejercicioRoutes = require("./routes/ejercicioRoutes");

dotenv.config();

const app = express();
connectDB();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rutas públicas (auth)
app.use("/api/auth", authRoutes);

// Ruta protegida de prueba/perfil
app.get("/api/entrenador/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Perfil del entrenador autenticado",
    entrenador: req.entrenador,
  });
});

// Rutas protegidas
app.use("/api/clientes", clienteRoutes);
app.use("/api/rutinas", rutinaRoutes);
app.use("/api/ejercicios", ejercicioRoutes);
// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor KORUS escuchando en http://localhost:${PORT}`);
});
