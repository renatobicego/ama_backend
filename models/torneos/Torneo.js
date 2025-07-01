const { Schema, model } = require("mongoose");

const TorneoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  lugar: {
    type: String,
    required: [true, "El lugar es obligatorio"],
  },
  fecha: {
    type: Date,
    required: [true, "La fecha es obligatoria"],
  },
  cantidadDias: {
    type: Number,
    required: [true, "La cantidad de dias es obligatorio"],
  },
  inscripcionesAbiertas: {
    type: Boolean,
    default: true,
  },
  requerirComprobante: {
    type: Boolean,
    default: true,
  },
  programaHorario: {
    type: String,
    default: "",
  },
  resultados: {
    type: String,
    default: "",
  },
  linkPagoFederados: {
    type: String,
    default: "",
  },
  linkPagoNoFederados: {
    type: String,
    default: "",
  },
  pruebasDisponibles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prueba",
      required: true,
    },
  ],
  categoriasDisponibles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  ],
  precioInscripcion: {
    cada: {
      type: Number,
      required: false,
    },
    ama: {
      type: Number,
      required: false,
    },
  },
});

module.exports = model("Torneo", TorneoSchema);
