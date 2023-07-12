const { response } = require('express');
const bcrypt = require('bcryptjs')
const bcryptSalt = process.env.BCRYPT_SALT
const crypto = require('crypto')

const {Usuario, Token} = require('../../models');

const { generarJWT } = require('../../helpers');
const sendEmail = require('../../utils/emails/sendEmail');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        return res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor en el login'
        });
    }   

}

const passwordResetRequest = async(req, res) => {
    // Obtener usuario con email
    const {email} = req.body
    const usuario = await Usuario.findOne({ email });

    // Si usuario no existe retornar error
    if (!usuario) {
        return res.status(400).json({msg: `Usuario con email ${email} no existe`})
    }

    // Si usuario creo un token anteriormente, se borra
    let token = await Token.findOne({ usuario: usuario._id });
    if (token) { 
        await token.deleteOne()
    }

    // Crear token
    let resetToken = crypto.randomBytes(32).toString("hex")
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt))

    await new Token({
        usuario: usuario._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

    const clientURL = 'localhost:3000'
    
    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${usuario._id}`;
    sendEmail(
        usuario.email,
        "Password Reset Request",
        {nombre: usuario.nombre_apellido,link: link},
        "./passwordReset/passwordResetRequest.handlebars"
        )
        
    return res.json({link})

}

const passwordReset = async(req, res) => {
    const {usuario, token, password} = req.body
    // Obtener token de reseteo de contraseña
    let passwordResetToken = await Token.findOne({ usuario });

    // Verificar si existe y si es válido
    if (!passwordResetToken) {
        return res.status(400).json({msg: "Token de restablecimiento de contraseña no válido o caducado"})
    }
    const tokenValido = await bcrypt.compare(token, passwordResetToken.token)
    if (!tokenValido) {
        return res.status(400).json({msg: "Token de restablecimiento de contraseña no válido o caducado"})
    }

    // Encriptar contraseña y guardar
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await Usuario.updateOne(
        { _id: usuario },
        { $set: { password: hash } },
        { new: true }
    )

    // Mail de confirmación
    const usuarioDb = await Usuario.findById(usuario);
    sendEmail(
        usuarioDb.email,
        "Contraseña reestablecida correctamente",
        {
        nombre: usuarioDb.nombre_apellido,
        },
        "./passwordReset/passwordResetSuccessful.handlebars"
    );
    await passwordResetToken.deleteOne()

    return res.json({usuarioDb})
}


module.exports = {
    login,
    passwordReset,
    passwordResetRequest
}
