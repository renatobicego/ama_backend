const { Schema, model } = require("mongoose");


const CategoriaNoticiaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre categoria obligatoria']
    }
})

module.exports = model('CategoriaNoticia', CategoriaNoticiaSchema)