const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio']
    }
})


module.exports = model( 'Categoria', CategoriaSchema )