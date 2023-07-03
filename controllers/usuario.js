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

const usuariosGet = async(req, res) => {
    const { limite = 5, desde = 0 } = req.query;

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params

    // Usuario borra su cuenta o administrador
    if (req.usuario.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar usuarios' });
    }

    const usuario = await Usuario.findByIdAndDelete( id );

    res.json(usuario);
}



module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosDelete
}