const { Schema, model } = require("mongoose");


const ParrafoSchema = Schema({
    texto: {
        type: String,
        required: [true, 'Texto obligatorio']
    },
    imagen: [{
        type: Schema.Types.ObjectId,
        ref: 'ImagenNoticia'
    }],
    titulo: {
        type: String,
        default: null
    }
})

module.exports = model('Parrafo', ParrafoSchema)