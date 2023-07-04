const { Schema, model } = require('mongoose');

const TorneoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    programaHorario: {
        type: String,
        default: ''
    },
    resultados: {
        type: String,
        default: ''
    },
    pruebasDisponibles: [{
        type: Schema.Types.ObjectId,
        ref: 'Prueba',
        required: true
    }],
    categoriasDisponibles: [{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }],
})

module.exports = model( 'Torneo', TorneoSchema )