const { Schema, model } = require('mongoose');

const PruebaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la prueba es obligatorio']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de la prueba es obligatorio']
    },
    categorias: [{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        default: []
    }]
})


module.exports = model( 'Prueba', PruebaSchema )