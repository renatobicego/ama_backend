const {Usuario} = require('../models/index')
const bcrypt = require('bcryptjs')

const usuariosPost = async (req, res) => {

    let {
        nombre_apellido, 
        email, 
        password, 
        rol, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni

    } = req.body

    const usuario = new Usuario({
        nombre_apellido, 
        email, 
        password, 
        rol, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni})

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)


    //Guardar Db
    await usuario.save()
    res.json({
        usuario
    })
}


module.exports = {
    usuariosPost
}