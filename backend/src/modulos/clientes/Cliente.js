const mongoose = require("mongoose");

const experienciaDeportivaSchema = new mongoose.Schema(
  {
    deporte: {
      type: String, 
      required: true,
      trim: true,
    },
    nivel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado", "competicion", "elite"],
      default: "principiante",
      index: true,
    },
    anosExperiencia: {
      type: Number, 
      min: 0,
    },
    compite: {
      type: Boolean,
      default: false,
    },
    comentarios: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const preferenciasSchema = new mongoose.Schema(
  {
    frecuenciaSemanalDeseada: {
      type: Number, 
      min: 1,
      max: 14,
    },
    materialDisponible: {
      type: [String], 
      default: [],
    },
    limitaciones: {
      type: [String], 
      default: [],
    },
    ubicacionesEntrenamiento: {
      type: [String], 
      default: [],
    },
    horariosPreferidos: {
      type: [String], 
      default: [],
    },
    deportesPreferidos: {
      type: [String], 
      default: [],
    },
  },
  { _id: false }
);

const clienteSchema = new mongoose.Schema(
  {
    
    entrenadores: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrenador",
    index: true
  }
],

    
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    apellidos: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    
    nombreMostrar: {
      type: String,
      trim: true,
      maxlength: 200,
      index: true,
    },

    
    correo: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo no válido"],
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    
    fechaNacimiento: {
      type: Date,
    },
    sexo: {
      type: String,
      enum: ["masculino", "femenino", "otro", "no-especifica"],
      default: "no-especifica",
    },
    
    fotoPerfilUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    
    objetivoPrincipal: {
      type: String,
      enum: [
        "perdida_grasa",
        "ganancia_muscular",
        "rendimiento",
        "salud_general",
        "rehabilitacion",
        "competicion",
        "otro",
      ],
      default: "salud_general",
      index: true,
    },
    objetivoSecundario: {
      type: String,
      enum: [
        "perdida_grasa",
        "ganancia_muscular",
        "rendimiento",
        "salud_general",
        "rehabilitacion",
        "competicion",
        "ninguno",
        "otro",
      ],
      default: "ninguno",
    },
    descripcionObjetivos: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    
    nivelGeneral: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado", "competicion", "elite"],
      default: "principiante",
      index: true,
    },

    
    experienciaDeportiva: {
      type: [experienciaDeportivaSchema],
      default: [],
    },

    
    estado: {
      type: String,
      enum: ["activo", "pausado", "finalizado", "archivado"],
      default: "activo",
      index: true,
    },

    
    notas: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    pesoInicialKg: {
      type: Number,
      min: 0,
    },
    pesoActualKg: {
      type: Number,
      min: 0,
    },
    alturaCm: {
      type: Number,
      min: 0,
    },
    porcentajeGrasa: {
      type: Number,
      min: 0,
      max: 100,
    },
    frecuenciaCardiacaReposo: {
      type: Number, 
      min: 20,
      max: 250,
    },
    preferencias: {
      type: preferenciasSchema,
      default: () => ({}),
    },

    rutinaActiva: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rutina",
      index: true,
    },
    historialRutinas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rutina",
      },
    ],

    // TAGS LIBRES PARA FILTRAR / SEGMENTAR (útil para el futuro)
    etiquetas: {
      type: [String], 
      default: [],
      index: true,
    },

    // SOFT DELETE / CONTROL INTERNO
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

// VIRTUAL: nombre completo
clienteSchema.virtual("nombreCompleto").get(function () {
  if (this.apellidos) return `${this.nombre} ${this.apellidos}`;
  return this.nombre;
});

// Antes de guardar, si no hay nombreMostrar, lo rellenamos
clienteSchema.pre("save", function (next) {
  if (!this.nombreMostrar) {
    this.nombreMostrar = this.apellidos
      ? `${this.nombre} ${this.apellidos}`
      : this.nombre;
  }
  next();
});


clienteSchema.index({ entrenadores: 1, estado: 1 });
clienteSchema.index({ entrenadores: 1, nombreMostrar: 1 });
clienteSchema.index({ entrenadores: 1, objetivoPrincipal: 1 });

module.exports = mongoose.model("Cliente", clienteSchema);
