const mongoose = require("mongoose");
const { Schema } = mongoose;

const ejercicioSchema = new Schema(
  {
    entrenadorId: {
      type: Schema.Types.ObjectId,
      ref: "Entrenador",
      required: true,
      index: true,
    },

    nombre: {
      type: String,
      required: [true, "El nombre del ejercicio es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    grupoMuscular: {
      type: String, 
      trim: true,
      maxlength: 80,
      index: true,
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    equipoNecesario: {
      type: [String], 
      default: [],
    },

    videoUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    
    etiquetas: {
      type: [String],
      default: [],
      index: true,
    },

    eliminado: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ejercicioSchema.index({ entrenadorId: 1, nombre: 1 });

module.exports = mongoose.model("Ejercicio", ejercicioSchema);
