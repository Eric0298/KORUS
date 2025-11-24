// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        korus: {
          // === Fondo general (azul noche tipo Apple Fitness) ===
          bg: "#0B1120",

          // === Cards / contenedores ===
          card: "#111827",   // gris-azul grafito Apple
          
          // === Borde sutil ===
          border: "#1E293B",

          // === Texto ===
          text: "#FFFFFF",
          textMuted: "#94A3B8",

          // === Acciones / Primario (azul eléctrico premium) ===
          primary: "#3B82F6",

          // === Estados ===
          success: "#22C55E", // verde éxito
          warning: "#FBBF24", // ámbar
          danger: "#EF4444",  // rojo error serio
        },
      },
    },
  },
  plugins: [],
};
