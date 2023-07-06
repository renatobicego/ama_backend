const {Schema, model} = require('mongoose')

const ClubSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    email: {
        type: String,
        required: [true, 'Email obligatorio'],
        unique: true
    },
    logoImg: {
        type: String,
        default: '',
    },
    ciudad: {
        type: String,
        required: true
    },
    federacion_paga: {
        type: Boolean,
        default: false
    },
    instagram: {
        type: String,
        default: '',
    },
    facebook: {
        type: String,
        default: '',
    },
    twitter: {
        type: String,
        default: '',
    },
    entrenadores: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }]

})

ClubSchema.methods.toJSON = function() {
    const {__v, _id, ...club} = this.toObject()
    club.uid = _id
    return club
}

module.exports = model('Club', ClubSchema);
