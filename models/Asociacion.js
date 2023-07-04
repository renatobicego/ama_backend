const { Schema, model } = require('mongoose');

const AsociacionSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la asociación es obligatorio']
    }
})


module.exports = model( 'Asociacion', AsociacionSchema )