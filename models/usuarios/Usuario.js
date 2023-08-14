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
    pais: {
        type: String,
        required: [true, 'País obligatorio']
    },
    sexo: {
        type: String,
        required: [true, 'Sexo obligatorio']
    },
    federacion: {
        type: Schema.Types.ObjectId,
        ref: 'Federacion',
        default: null
    },
    asociacion: {
        type: Schema.Types.ObjectId,
        ref: 'Asociacion',
        default: null
    },
    club: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
        default: null
    }
})

UsuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
})

UsuarioSchema.pre("findOneAndUpdate", async function (next) {
    if (!this.getUpdate().password) {
      return next();
    }
    const hash = await bcrypt.hash(this.getUpdate().password, Number(bcryptSalt));
    this._update.password = hash;
    next();
})
  

UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

module.exports = model('Usuario', UsuarioSchema);