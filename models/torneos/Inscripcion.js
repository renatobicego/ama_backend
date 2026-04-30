const { Schema, model } = require("mongoose");

const InscripcionSchema = Schema({
  torneo: {
    type: Schema.Types.ObjectId,
    ref: "Torneo",
    required: true,
  },
  atleta: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  pruebasInscripto: [
    {
      type: Schema.Types.ObjectId,
      ref: "PruebaAtleta",
      required: true,
    },
  ],
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  comprobante: {
    type: String,
    required: false,
  },
  numero: {
    type: Number,
    default: null,
  },
  esFederado: {
    type: Boolean,
    default: false,
  },
  fuenteRegistro: {
    type: String,
    enum: ["app", "cada", "libre"],
    default: "app",
  },
  // ── Payment fields (all optional with defaults to avoid breaking existing systems) ──
  pagado: {
    type: Boolean,
    default: false,
  },
  metodoPago: {
    type: String,
    enum: ["Efectivo", "Transferencia"],
    default: "Efectivo",
  },
  monto: {
    type: Number,
    default: 0,
  },
  manual: {
    type: Boolean,
    default: false,
  },
  anticipado: {
    type: Boolean,
    default: false,
  },
  observacion: {
    type: String,
    default: null,
  },
});

// Indexes
InscripcionSchema.index(
  { torneo: 1, numero: 1 },
  { unique: true, sparse: true },
);
InscripcionSchema.index({ torneo: 1, atleta: 1 }, { unique: true });
InscripcionSchema.index({ torneo: 1, pagado: 1 });

module.exports = model("Inscripcion", InscripcionSchema);
