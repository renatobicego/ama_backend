const {borrarArchivoFirebase } = require("../../helpers")
const { Campeon } = require("../../models")


const campeonPost = async(req, res) => {

    // Obtener datos
    const {nombre_apellido, pruebasCampeon, img} = req.body
    
    try {
        const campeon = new Campeon({nombre_apellido, pruebasCampeon, img})
        await campeon.save()
    
        return res.json({campeon})

    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
      
}

const campeonGet = async(req, res) => {
    // Query obtener todos los campeones
    try {
        const campeones = await Campeon.find().populate('pruebasCampeon', 'nombre').lean()
        res.json({campeones})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}

const campeonGetPorId = async(req, res) => {
    // Query obtener todos los campeones
    const {id} = req.params
    try {
        const campeon = await Campeon.findById(id).populate('pruebasCampeon', 'nombre').lean()
        res.json({campeon})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}

const campeonPut = async(req, res) => {
    const {id} = req.params
    const {_id, ...resto} = req.body

    try {

        const campeon = await Campeon.findByIdAndUpdate(id, resto)
        // Borrar foto anterior
        if(resto.img){
            await borrarArchivoFirebase(campeon.img)
        }
        return res.json({campeon})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})   
        
    }

}

const campeonDelete = async(req, res) => {
    const {id} = req.params

    // Solo administradores y editores pueden borrar campeones
    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado' })
    }

    try {
        const campeon = await Campeon.findByIdAndDelete(id)
        await borrarArchivoFirebase(campeon.img)
        
        return res.json({campeon})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})   
    }
}

module.exports = {
    campeonPost,
    campeonPut,
    campeonDelete,
    campeonGet,
    campeonGetPorId
}