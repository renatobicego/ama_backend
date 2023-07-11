const { subirArchivoFirebase, borrarArchivoFirebase } = require('../../helpers')
const {validarArchivos} = require('../../helpers')
const comprimirArchivos = require('../../helpers/functions/comprimirArchivos')
const {Club} = require('../../models')


const clubPost = async (req, res) => {

    let {
        nombre, 
        email, 
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        federacion_paga

    } = req.body

    // Obtener logo de club
    let {logoImg} = req.files

    // Validad extension y tamaño
    validarArchivos(logoImg, res, ['jpg', 'jpeg', 'png'])

    // Subir a firebase el logo
    let fbLinkImage 
    try {
        logoImg = await comprimirArchivos(logoImg, 'png')
        fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
    } catch (error) {
        
        return res.status(500).json({msg: error.message})
    }
     
    const club = new Club({
        nombre, 
        email, 
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        federacion_paga,
        logoImg: fbLinkImage
    })

    //Guardar Db
    await club.save()
    res.json({
        club
    })
}

const clubGet = async(req, res) => {

    // Query
    const [ total, clubes ] = await Promise.all([
        Club.countDocuments(),
        Club.find()
            .populate("entrenadores", ["nombre_apellido", "telefono"])
            .lean()
    ]);

    res.json({
        total,
        clubes
    });
}

const clubDelete = async(req, res) => {
    const { id } = req.params

    // Solo administradores pueden borrar clubes
    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar clubes' })
    }

    const club = await Club.findByIdAndDelete( id )

    // Borrar logo
    try {
        await borrarArchivoFirebase(club.logoImg)
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

    res.json(club)
}

const clubPut = async(req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    // Si el logo es cambiado, actualizar
    if ( req.files ) {
        let fbLinkImage 
        let {logoImg} = req.files

        // Validad extension y tamaño
        validarArchivos(logoImg, res, ['jpg', 'jpeg', 'png'])

        try {
            logoImg = await comprimirArchivos(logoImg, 'png')
            fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
        resto.logoImg = fbLinkImage
    }

    const club = await Club.findByIdAndUpdate( id, resto )

    // Borrar logo anterior si usuario lo cambia (Club.findByIdAndUpdate retorna valores anteriores al update)
    if ( req.files ){
        try {
            await borrarArchivoFirebase(club.logoImg)
        } catch (error) {
            return res.status(500).json({ msg: error })
        }
    }

    res.json(club)
} 

module.exports = {
    clubPost,
    clubGet,
    clubDelete,
    clubPut
}

