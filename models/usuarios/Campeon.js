const { Schema, model } = require("mongoose");

const CampeonSchema = Schema({
    nombre_apellido: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    pruebasCampeon: [{
        type: Schema.Types.ObjectId,
        ref: 'Prueba',
        required: true
    }]
})

module.exports = model('Campeon', CampeonSchema)