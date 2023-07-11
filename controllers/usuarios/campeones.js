const { validarArchivos, subirArchivoFirebase, borrarArchivoFirebase } = require("../../helpers")
const comprimirArchivos = require("../../helpers/functions/comprimirArchivos")
const { Campeon } = require("../../models")


const campeonPost = async(req, res) => {

    // Obtener datos
    const {nombreApellido, pruebasCampeon} = req.body
    let {img} = req.files

    // Subir imagen de campeon (validado por middleware que no está vacia)
    const msg = validarArchivos(img, ['png', 'jepg', 'jpg'])
    if(msg){
        return res.status(401).json({msg})
    }

    // Comprimir y subir archivo
    let fbLinkImg
    try {
        img = await comprimirArchivos(img, 'jpeg')
        fbLinkImg = await subirArchivoFirebase(img, 'campeonesImg/')
        const campeon = new Campeon({nombreApellido, pruebasCampeon, img: fbLinkImg})
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

const campeonPut = async(req, res) => {
    const {id} = req.params
    const {_id, ...resto} = req.body
    
    // Si cambia la imagen, subir nueva imagen
    if(req.files){
        let {img} = req.files

        // Validar extensión y tamaño
        const msg = validarArchivos(img, ['png', 'jepg', 'jpg'])
        if(msg){
            return res.status(401).json({msg})
        }
        
        // Subir imagen de campeon (validado por middleware que no está vacia)
        try {
            img = await comprimirArchivos(img, 'jpeg')
            resto.img = await subirArchivoFirebase(img, 'campeonesImg/')
        } catch (error) {
            return res.status(500).json({msg: error.message})   
        }
        
    }

    try {

        const campeon = await Campeon.findByIdAndUpdate(id, resto)
        // Borrar foto anterior
        if(req.files){
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
    campeonGet
}