// src/server.js
const express = require("express");
const cors = require("cors");
const corsOptions = require("./comun/infraestructura/corsConfig");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./comun/infraestructura/db");

// Logger personalizado
const logger = require("./comun/infraestructura/logger");
const requestLogger = require("./comun/infraestructura/middlewares/requestLogger");

// Rutas / módulos
const authRoutes = require("./modulos/auth/authRoutes");
const verificarToken = require("./comun/infraestructura/middlewares/authMiddleware");
const clienteRoutes = require("./modulos/clientes/clienteRoutes");
const rutinaRoutes = require("./modulos/rutinas/rutinaRoutes");
const ejercicioRoutes = require("./modulos/ejercicios/ejercicioRoutes");
const equipoRoutes= require("./modulos/equipos/equipo.routes");

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

// Logger de peticiones (cada request se registra)
app.use(requestLogger);

// CORS controlado por .env (CORS_ORIGINS)
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Healthcheck público
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Rate limit SOLO para auth (anti fuerza-bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensaje:
      "Demasiadas peticiones de autenticación desde esta IP, inténtalo más tarde",
  },
});

// Rutas públicas
app.use("/api/auth", authLimiter, authRoutes);

// Ruta protegida de prueba/perfil
app.get("/api/entrenador/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Perfil del entrenador autenticado",
    entrenador: req.entrenador,
  });
});

// Rutas protegidas
app.use("/api/clientes", verificarToken, clienteRoutes);
app.use("/api/rutinas", verificarToken, rutinaRoutes);
app.use("/api/ejercicios", verificarToken, ejercicioRoutes);
app.use("/api/equipos", verificarToken, equipoRoutes);


// Middlewares finales
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(
    `Servidor KORUS escuchando en http://localhost:${PORT} (MODE: ${
      process.env.NODE_ENV || "development"
    })`
  );
});
