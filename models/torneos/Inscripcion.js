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
});

module.exports = model("Inscripcion", InscripcionSchema);
