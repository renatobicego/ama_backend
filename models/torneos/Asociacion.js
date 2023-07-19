const { Schema, model } = require('mongoose');

const AsociacionSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la asociación es obligatorio']
    },
    siglas: {
        type: String,
        required: [true, 'Siglas de la asociación es obligatoria']
    }
})


module.exports = model( 'Asociacion', AsociacionSchema )