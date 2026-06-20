const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la categoría es obligatorio"],
  },
  // Master category: shown as "Master" in UI, exported as "Mayores" in a separate MDB file
  esMaster: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Categoria", CategoriaSchema);
