const isProd = process.env.NODE_ENV === "production";

function format(level, message, meta = {}) {
  const time = new Date().toISOString();
  const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
  return `[${level.toUpperCase()}] ${time} - ${message}${metaString}`;
}

const logger = {
  info: (msg, meta) => {
    console.log(format("info", msg, meta));
  },

  warn: (msg, meta) => {
    console.warn(format("warn", msg, meta));
  },

  error: (msg, meta) => {
    console.error(format("error", msg, meta));
  },

  // Opcional: logs más detallados solo en desarrollo
  debug: (msg, meta) => {
    if (!isProd) {
      console.log(format("debug", msg, meta));
    }
  },
};

module.exports = logger;