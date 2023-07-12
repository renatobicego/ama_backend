const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')
const bcryptSalt = process.env.BCRYPT_SALT

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
    role: {
        type: String,
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
        required: [true, 'DNI obligatorio'],
        unique: true
    },
    federacion: {
        type: Schema.Types.ObjectId,
        ref: 'Federacion'
    },
    asociacion: {
        type: Schema.Types.ObjectId,
        ref: 'Asociacion'
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
    },
    pruebasFavoritas: [{
        type: Schema.Types.ObjectId,
        ref: 'PruebaAtleta'
    }]
})

UsuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
  })

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

module.exports = model('Usuario', UsuarioSchema);