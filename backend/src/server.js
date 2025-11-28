const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const verificarToken = require("./middleware/authMiddleware");
const clienteRoutes = require("./routes/clienteRoutes");
const rutinaRoutes = require("./routes/rutinaRoutes");
const ejercicioRoutes = require("./routes/ejercicioRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
connectDB();


app.use(helmet());


app.use(cors());


app.use(express.json());

// Rate limit SOLO para auth (para evitar fuerza bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máx 100 peticiones por IP en ese intervalo
  standardHeaders: true, // devuelve info de rate limit en cabeceras estándar
  legacyHeaders: false,
  message: {
    mensaje:
      "Demasiadas peticiones de autenticación desde esta IP, inténtalo más tarde",
  },
});

// Rutas públicas (auth) con rate-limit aplicado
app.use("/api/auth", authLimiter, authRoutes);

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

// Middlewares finales
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor KORUS escuchando en http://localhost:${PORT}`);
});
