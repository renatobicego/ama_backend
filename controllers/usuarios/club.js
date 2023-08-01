const { borrarArchivoFirebase } = require('../../helpers')
const {Club} = require('../../models')

const clubPost = async (req, res) => {

    let {
        nombre,
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        siglas,
        logoImg
    } = req.body

    try {

        const club = new Club({
            nombre, 
            ciudad, 
            entrenadores, 
            instagram,
            facebook,
            twitter,
            logoImg,
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
            Club.find().lean()
        ]);
    
        return res.json({
            total,
            clubes
        });
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}

const clubGetPorNombre = async(req, res) => {
    const nombre = decodeURIComponent(req.params.nombre)
    try {
        // Query
        const club = await Club.findOne({nombre})
                .populate("entrenadores", ["nombre_apellido", "telefono"])
                .lean()
    
        return res.json({
            club
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

    try {
        const club = await Club.findByIdAndUpdate( id, resto )
        // Borrar logo anterior si usuario lo cambia (Club.findByIdAndUpdate retorna valores anteriores al update)
        if ( resto.logoImg ){
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
    clubPut,
    clubGetPorNombre
}

