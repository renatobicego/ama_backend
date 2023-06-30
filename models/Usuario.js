const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre_apellido: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    email: {
        type: String,
        required: [true, 'Email obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña obligatorio'],
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'ENTRENADOR_ROLE', 'EDITOR_ROLE']
    },
    federacion_paga: {
        type: Boolean,
        default: false
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'Fecha de nacimiento obligatoria']
    },
    telefono: {
        type: String,
        default: ''
    },
    dni: {
        type: String,
        required: [true, 'DNI obligatorio']
    }

})

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

module.exports = model('Usuario', UsuarioSchema);