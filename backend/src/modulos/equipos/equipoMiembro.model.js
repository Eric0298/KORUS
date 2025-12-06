const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const LesionSchema = new Schema(
  {
    parteCuerpo: {
      type: String,
      trim: true,
    },
    tipoLesion: {
      type: String,
      trim: true,
    },
    gravedad: {
      type: String,
      enum: ['leve', 'moderada', 'grave'],
      default: 'leve',
    },
    fechaInicio: {
      type: Date,
    },
    fechaFinEstimada: {
      type: Date,
    },
    notas: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const RutinaAsignadaSchema = new Schema(
  {
    rutina: {
      type: Schema.Types.ObjectId,
      ref: 'Rutina',
      required: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
    },
    diasSemana: [
      {
        type: String,
        enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      },
    ],
    hora: {
      type: String, 
    },
    notas: {
      type: String,
      trim: true,
    },
    origen: {
      type: String,
      enum: ['equipo', 'individual'],
      default: 'individual',
    },
  },
  { _id: false }
);

const EquipoMiembroSchema = new Schema(
  {
    equipo: {
      type: Schema.Types.ObjectId,
      ref: 'Equipo',
      required: true,
    },
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },

    alturaCm: {
      type: Number,
    },
    pesoKg: {
      type: Number,
    },
    lateralidad: {
      type: String,
      enum: ['diestro', 'zurdo', 'ambidiestro'],
      default: 'diestro',
    },
    porcentajeGrasa: {
      type: Number,
    },

    posicion: {
      type: String,
      trim: true,
    },

    esCapitan: {
      type: Boolean,
      default: false,
    },

    estado: {
      type: String,
      enum: ['activo', 'lesionado', 'rehabilitacion'],
      default: 'activo',
    },

    lesion: LesionSchema,

    rutinasIndividuales: [RutinaAsignadaSchema],

    fechaAlta: {
      type: Date,
      default: Date.now,
    },
    fechaBaja: {
      type: Date,
    },

    notas: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EquipoMiembroSchema.index(
  { equipo: 1, cliente: 1 },
  { unique: true }
);

const EquipoMiembro = model('EquipoMiembro', EquipoMiembroSchema);

module.exports = EquipoMiembro;
