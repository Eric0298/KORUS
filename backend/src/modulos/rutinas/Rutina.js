const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Subdocumento para la progresión de un ejercicio por semana de la rutina.
 * Importante: "semana" aquí es el BLOQUE de progresión (1..semanasTotales).
 *   Ejemplo:
 *     semana: 1, series: 4, repeticiones: "12", pesoObjetivo: 10, rir: 2
 */
const progresionSemanaSchema = new Schema(
  {
    semana: {
      type: Number, 
      required: true,
      min: 1,
      max: 52,
    },
    series: {
      type: Number,
      min: 1,
      max: 20,
    },
    repeticiones: {
      type: String, 
      trim: true,
      maxlength: 50,
    },
    pesoObjetivo: {
      type: Number, 
    },
    rir: {
      type: Number, 
      min: 0,
      max: 5,
    },
    notasSemana: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

/**
 * Subdocumento para un ejercicio dentro de un día de rutina.
 * - Puede referenciar un Ejercicio de catálogo (ejercicioId).
 * - Guarda también nombreEjercicio/grupoMuscular como "foto" en el momento.
 * - La progresión por semanas va en "progresion".
 */
const ejercicioRutinaSchema = new Schema(
  {
    ejercicioId: {
      type: Schema.Types.ObjectId,
      ref: "Ejercicio",
    },

    nombreEjercicio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    grupoMuscular: {
      type: String,
      trim: true,
      maxlength: 80,
    },

    
    orden: {
      type: Number,
      min: 1,
    },

    descansoSegundos: {
      type: Number,
      min: 0,
      max: 600,
    },

    notas: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Progresión por semana (clave para rutinas tipo 1/5, 2/6, 3/7, 4/8...)
    progresion: {
      type: [progresionSemanaSchema],
      default: [],
    },
  },
  { _id: false }
);


const diaRutinaSchema = new Schema(
  {
    nombreDia: {
      type: String, 
      trim: true,
      maxlength: 120,
    },
    orden: {
      type: Number, 
      min: 1,
    },
    ejercicios: {
      type: [ejercicioRutinaSchema],
      default: [],
    },
  },
  { _id: false }
);

const rutinaSchema = new Schema(
  {
    entrenadorId: {
      type: Schema.Types.ObjectId,
      ref: "Entrenador",
      required: true,
      index: true,
    },

    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      index: true,
    },

    nombre: {
      type: String,
      required: [true, "El nombre de la rutina es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 150,
      index: true,
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    objetivo: {
      type: String,
      enum: [
        "perdida_grasa",
        "ganancia_muscular",
        "rendimiento",
        "salud_general",
        "rehabilitacion",
        "competicion",
        "mantenimiento",
        "otro",
      ],
      default: "salud_general",
      index: true,
    },

    nivel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado", "competicion", "elite"],
      default: "principiante",
      index: true,
    },

    tipoSplit: {
      type: String,
      trim: true,
      maxlength: 80,
    },

    diasPorSemana: {
      type: Number,
      min: 1,
      max: 14,
    },

    // Número total de semanas planificadas en la rutina
    semanasTotales: {
      type: Number,
      min: 1,
      max: 52,
    },

    dias: {
      type: [diaRutinaSchema],
      default: [],
    },

    estado: {
      type: String,
      enum: ["borrador", "activa", "archivada", "plantilla", "completada"],
      default: "borrador",
      index: true,
    },

    esPlantilla: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Fechas de uso real cuando se asigna a un cliente
    fechaInicioUso: {
      type: Date,
    },
    fechaFinUso: {
      type: Date,
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

// Índices útiles
rutinaSchema.index({ entrenadorId: 1, clienteId: 1, estado: 1 });
rutinaSchema.index({ entrenadorId: 1, esPlantilla: 1 });
rutinaSchema.index({ entrenadorId: 1, esPlantilla: 1, objetivo: 1 });

/**
 * Validador: si semanasTotales está definido, comprueba que
 * todas las progresiones tienen "semana" en el rango 1..semanasTotales.
 */
rutinaSchema.pre("save", function (next) {
  if (!this.semanasTotales) {
    return next();
  }

  for (const dia of this.dias) {
    for (const ejercicio of dia.ejercicios) {
      for (const prog of ejercicio.progresion) {
        if (prog.semana < 1 || prog.semana > this.semanasTotales) {
          return next(
            new Error(
              `Semana ${prog.semana} fuera de rango 1-${this.semanasTotales} en el ejercicio "${ejercicio.nombreEjercicio}".`
            )
          );
        }
      }
    }
  }

  next();
});

module.exports = mongoose.model("Rutina", rutinaSchema);
