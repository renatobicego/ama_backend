const {Usuario, PruebaAtleta} = require('../models/index')
const bcrypt = require('bcryptjs')

const usuariosPost = async (req, res) => {

    // Selecciono cada variable que quiero guardar para evitar 
    // guardar datos mandados en body erroneamente

    let {
        nombre_apellido, 
        email, 
        password, 
        role, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club,
        pruebasFavoritas
    } = req.body

    const usuario = new Usuario({
        nombre_apellido, 
        email, 
        password, 
        role, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club
    })

    // Guardar pruebas favoritas
    let pruebasArr = []
    if(pruebasFavoritas.length > 0){
        pruebasArr = await Promise.all(pruebasFavoritas.map(async (prueba) => {
            const {marca, prueba: pruebaId} = prueba
            const pruebaAtleta = new PruebaAtleta({marca, atleta: usuario._id, prueba: pruebaId})
            await pruebaAtleta.save()
            return pruebaAtleta._id
        }))
        usuario.pruebasFavoritas = pruebasArr
    }

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
    // Limitar respuesta
    const { limite = 10, desde = 0 } = req.query;

    // Query
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .populate("club", "nombre")
            .populate("federacion", "nombre")
            .populate("asociacion", "nombre")
            .populate({
                path: "pruebasFavoritas",
                select: ["marca"],
                populate: {
                  path: "prueba",
                  select: ["nombre"],
                },
              })
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosGetPorClub = async(req, res) => {

    const {idClub} = req.params
    // Query
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find({club: idClub})
            .populate("club", "nombre")
            .populate("federacion", "nombre")
            .populate("asociacion", "nombre")
            .populate({
                path: "pruebasFavoritas",
                select: ["marca"],
                populate: {
                  path: "prueba",
                  select: ["nombre"],
                },
              })
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, ...resto } = req.body;

    // Si usuario quiere cambiar contraseña
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    // Guardar pruebas favoritas
    const {pruebasFavoritas} = resto

    if(pruebasFavoritas.length > 0){
        await pruebasFavoritas.forEach(async (prueba) => {
            const {_id, atleta, ...restoPrueba} = prueba
            await PruebaAtleta.findByIdAndUpdate(_id, restoPrueba)
        })
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto )

    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params

    // Usuario borra su cuenta o administrador
    if (req.usuario.id !== id && req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar usuarios' });
    }

    const usuario = await Usuario.findByIdAndDelete( id )

    await usuario.pruebasFavoritas.forEach(async (prueba) => {
        await PruebaAtleta.findByIdAndDelete(prueba._id)
    })

    res.json(usuario);
}



module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosGetPorClub
}