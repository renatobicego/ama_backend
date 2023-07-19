const { Schema, model } = require("mongoose");


const ParrafoSchema = Schema({
    texto: {
        type: String,
        required: [true, 'Texto obligatorio']
    },
    imagenes: [{
        type: Schema.Types.ObjectId,
        ref: 'ImagenNoticia'
    }],
    titulo: {
        type: String,
        default: null
    },
    orden: {
        type: Number,
        required: true
    }
})

module.exports = model('Parrafo', ParrafoSchema)