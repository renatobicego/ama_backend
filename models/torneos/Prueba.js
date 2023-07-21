const { Schema, model } = require('mongoose');

const PruebaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la prueba es obligatorio']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de la prueba es obligatorio']
    }
})


module.exports = model( 'Prueba', PruebaSchema )