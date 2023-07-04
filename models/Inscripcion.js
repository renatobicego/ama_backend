const { Schema, model } = require('mongoose');

const InscripcionSchema = Schema({
    marca: {
        type: String,
        required: [true, 'La marca es obligatoria']
    },
    atleta: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    prueba: {
        type: Schema.Types.ObjectId,
        ref: 'Prueba',
        required: true
    },
})


module.exports = model( 'Inscripcion', InscripcionSchema )