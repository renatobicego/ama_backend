const bcrypt = require('bcryptjs')
const { Usuario, PruebaAtleta } = require('../../models')

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

    try {
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
        return res.json({
            usuario
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const usuariosGet = async(req, res) => {
    // Limitar respuesta
    const { limite = 10, desde = 0 } = req.query;

    try {
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
                .lean()
        ]);
    
        return res.json({
            total,
            usuarios
        });
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const usuariosGetPorClub = async(req, res) => {

    const {idClub} = req.params

    try {
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
                .lean()
        ]);
    
        return res.json({
            total,
            usuarios
        });
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, ...resto } = req.body;

    try {
        // Si usuario quiere cambiar contraseña
        if ( password ) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync( password, salt );
        }
    
        const usuario = await Usuario.findByIdAndUpdate( id, resto )
    
        return res.json(usuario)
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params

    // Usuario borra su cuenta o administrador
    if (req.usuario.id !== id && req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar usuarios' });
    }

    try {
        const usuario = await Usuario.findByIdAndDelete( id )
    
        await usuario.pruebasFavoritas.forEach(async (prueba) => {
            await PruebaAtleta.findByIdAndDelete(prueba._id)
        })
    
        return res.json(usuario)
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }

}



module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosPut,
    usuariosDelete,
    usuariosGetPorClub
}