const { subirArchivoFirebase, borrarArchivoFirebase } = require('../../helpers')
const {validarArchivos} = require('../../helpers')
const comprimirArchivos = require('../../helpers/functions/comprimirArchivos')
const {Club} = require('../../models')


const clubPost = async (req, res) => {

    let {
        nombre,
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        siglas
    } = req.body

    // Obtener logo de club
    let {logoImg} = req.files

    // Validar extension y tamaño
    const msg = validarArchivos(logoImg, ['jpg', 'jpeg', 'png'])
    if(msg){
        return res.status(401).json({msg})
    }

    // Subir a firebase el logo
    let fbLinkImage 
    try {
        logoImg = await comprimirArchivos(logoImg, 'png')
        fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
        const club = new Club({
            nombre, 
            ciudad, 
            entrenadores, 
            instagram,
            facebook,
            twitter,
            logoImg: fbLinkImage,
            siglas
        })
    
        //Guardar Db
        await club.save()
        return res.json({
            club
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
     
}

const clubGet = async(req, res) => {

    try {
        // Query
        const [ total, clubes ] = await Promise.all([
            Club.countDocuments(),
            Club.find()
                .populate("entrenadores", ["nombre_apellido", "telefono"])
                .lean()
        ]);
    
        return res.json({
            total,
            clubes
        });
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}

const clubDelete = async(req, res) => {
    const { id } = req.params

    // Solo administradores pueden borrar clubes
    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar clubes' })
    }

    // Borrar club y logo
    try {
        const club = await Club.findByIdAndDelete( id )
        await borrarArchivoFirebase(club.logoImg)
        res.json(club)
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const clubPut = async(req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    // Si el logo es cambiado, actualizar
    if ( req.files ) {
        let fbLinkImage 
        let {logoImg} = req.files

        // Validar extension y tamaño
        const msg = validarArchivos(logoImg, ['jpg', 'jpeg', 'png'])
        if(msg){
            return res.status(401).json({msg})
        }

        try {
            logoImg = await comprimirArchivos(logoImg, 'png')
            fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/')
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
        resto.logoImg = fbLinkImage
    }

    try {
        const club = await Club.findByIdAndUpdate( id, resto )
        // Borrar logo anterior si usuario lo cambia (Club.findByIdAndUpdate retorna valores anteriores al update)
        if ( req.files ){
            await borrarArchivoFirebase(club.logoImg)
        }
    
        return res.json(club)
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

} 

module.exports = {
    clubPost,
    clubGet,
    clubDelete,
    clubPut
}

