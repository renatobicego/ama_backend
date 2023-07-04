const { Schema, model } = require('mongoose');

const FederacionSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la federación es obligatorio']
    }
})


module.exports = model( 'Federacion', FederacionSchema )