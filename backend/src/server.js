// src/server.js
const express = require("express");
const cors = require("cors");
const corsOptions = require("./comun/infraestructura/corsConfig");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./comun/infraestructura/db");

// Rutas / módulos
const authRoutes = require("./modulos/auth/authRoutes");
const verificarToken = require("./comun/infraestructura/middlewares/authMiddleware");
const clienteRoutes = require("./modulos/clientes/clienteRoutes");
const rutinaRoutes = require("./modulos/rutinas/rutinaRoutes");
const ejercicioRoutes = require("./modulos/ejercicios/ejercicioRoutes");

// Middlewares de errores
const {
  notFound,
  errorHandler,
} = require("./comun/infraestructura/middlewares/errorMiddleware");

dotenv.config();

const app = express();
connectDB();

// Seguridad básica
app.use(helmet());

// CORS controlado por .env (CORS_ORIGINS)
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Healthcheck público (sin auth)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Rate limit SOLO para auth (para evitar fuerza bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máx 100 peticiones por IP en ese intervalo
  standardHeaders: true,
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

// Rutas protegidas con JWT
app.use("/api/clientes", clienteRoutes);
app.use("/api/rutinas", rutinaRoutes);
app.use("/api/ejercicios", ejercicioRoutes);

// Middlewares finales
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Servidor KORUS escuchando en http://localhost:${PORT} (NODE_ENV: ${
      process.env.NODE_ENV || "development"
    })`
  );
});
