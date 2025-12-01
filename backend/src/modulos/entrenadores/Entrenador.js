const mongoose = require("mongoose");

const entrenadorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo no válido"],
    },
    contrasena: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: 6, 
    },

    telefono: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    rol: {
      type: String,
      enum: ["entrenador", "admin"],
      default: "entrenador",
      index: true,
    },

    plan: {
      type: String,
      enum: ["free", "pro", "gimnasio"],
      default: "free",
      index: true,
    },

    estado: {
      type: String,
      enum: ["activo", "suspendido", "eliminado"],
      default: "activo",
      index: true,
    },

    ajustes: {
      idioma: {
        type: String,
        default: "es",
      },
      zonaHoraria: {
        type: String,
        default: "Europe/Madrid",
      },
      tema: {
        type: String,
        enum: ["claro", "oscuro", "sistema"],
        default: "claro",
      },
    },

    ultimoAcceso: {
      type: Date,
    },

    gimnasioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gimnasio", 
    },
  },
  {
    timestamps: true, 
  }
);

entrenadorSchema.index({ plan: 1, estado: 1 }); 

module.exports = mongoose.model("Entrenador", entrenadorSchema);
