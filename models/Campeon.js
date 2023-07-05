const { Schema, model } = require("mongoose");

const CampeonSchema = Schema({
    nombreApellido: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    pruebasCampeon: [{
        type: Schema.Types.ObjectId,
        required: true
    }]
})

module.exports = model('Campeon', CampeonSchema)