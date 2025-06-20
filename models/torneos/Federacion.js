const { Schema, model } = require('mongoose');

const FederacionSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la federación es obligatorio']
    },
    siglas: {
        type: String,
        required: [true, 'Siglas de la federación es obligatoria']
    }
})


module.exports = model( 'Federacion', FederacionSchema )