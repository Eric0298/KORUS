const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const EquipoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    deporte: {
      type: String,
      required: true,
      trim: true,
    },

    entrenador: {
      type: Schema.Types.ObjectId,
      ref: 'Entrenador', 
      required: true,
    },

    miembros: [
      {
        type: Schema.Types.ObjectId,
        ref: 'EquipoMiembro',
      },
    ],

    rutinasEquipo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rutina', 
      },
    ],

    descripcion: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

EquipoSchema.index({ entrenador: 1 });

const Equipo = model('Equipo', EquipoSchema);

module.exports = Equipo;
