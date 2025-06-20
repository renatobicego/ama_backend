const { Schema, model } = require("mongoose");


const ParrafoSchema = Schema({
    texto: {
        type: String,
        required: [true, 'Texto obligatorio']
    },
    imagenes: {
        type: Schema.Types.ObjectId,
        ref: 'ImagenNoticia',
        default: null
    },
    titulo: {
        type: String,
        default: null
    },
    orden: {
        type: Number,
        default: 0
    }
})

module.exports = model('Parrafo', ParrafoSchema)