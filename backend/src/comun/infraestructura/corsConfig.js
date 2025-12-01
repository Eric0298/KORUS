const allowedOriginsEnv = process.env.CORS_ORIGINS || "";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
  const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS: origen no permitido -> ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, 
};

module.exports = corsOptions;