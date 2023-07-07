const { Schema, model } = require("mongoose");


const NoticiaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'Titulo obligatorio']
    },
    subtitulo: {
        type: String,
        required: [true, 'Subitulo obligatorio']
    },
    cuerpo: [{
        type: Schema.Types.ObjectId,
        ref: 'Parrafo',
        required: true
    }],
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    imgPortada: {
        type: Schema.Types.ObjectId,
        ref: 'ImagenNoticia',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'CategoriaNoticia',
        required: true
    }
})

module.exports = model('Noticia', NoticiaSchema)