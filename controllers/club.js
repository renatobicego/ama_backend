const { subirArchivoFirebase, borrarArchivoFirebase } = require('../helpers')
const {validarExtension, validarSize} = require('../helpers')
const {Club} = require('../models')

const validarLogo = (logoImg, res) => {
    // Validar la extension
    if(!validarExtension(logoImg, ['jpg', 'jpeg', 'png'])){
        return res.status(401).json({msg: 'Extensión no permitida'})
    }

    // Validar tamaño de archivo
    if(!validarSize(logoImg)){
        return res.status(401).json({msg: 'El archivo debe ser menor a 10MB'})
    }
}

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
    const {logoImg} = req.files

    // Validad extension y tamaño
    validarLogo(logoImg, res)

    // Subir a firebase el logo
    let fbLinkImage 
    try {
        fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
    } catch (error) {
        return res.status(500).json({msg: error})
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

    const [ total, clubes ] = await Promise.all([
        Club.countDocuments(),
        Club.find()
            .populate("entrenadores", ["nombre_apellido", "telefono"])
    ]);

    res.json({
        total,
        clubes
    });
}

const clubDelete = async(req, res) => {
    const { id } = req.params

    if (req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar clubes' })
    }

    const club = await Club.findByIdAndDelete( id )

    try {
        await borrarArchivoFirebase(club.logoImg)
    } catch (error) {
        return res.status(500).json({ msg: error })
    }

    res.json(club)
}

const clubPut = async(req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    // Si el logo es cambiado, actualizar
    if ( req.files.logoImg ) {
        let fbLinkImage 
        const {logoImg} = req.files

        // Validad extension y tamaño
        validarLogo(logoImg, res)

        try {
            fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
        } catch (error) {
            return res.status(500).json({msg: error})
        }
        resto.logoImg = fbLinkImage
    }

    const club = await Club.findByIdAndUpdate( id, resto )

    try {
        await borrarArchivoFirebase(club.logoImg)
    } catch (error) {
        return res.status(500).json({ msg: error })
    }

    res.json(club)
} 

module.exports = {
    clubPost,
    clubGet,
    clubDelete,
    clubPut
}

