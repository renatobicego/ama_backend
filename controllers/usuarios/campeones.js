const { validarArchivos, subirArchivoFirebase, borrarArchivoFirebase } = require("../helpers")
const comprimirArchivos = require("../helpers/functions/comprimirArchivos")
const { Campeon } = require("../models")


const campeonPost = async(req, res) => {

    // Obtener datos
    const {nombreApellido, pruebasCampeon} = req.body
    let {img} = req.files

    // Subir imagen de campeon (validado por middleware que no está vacia)
    validarArchivos(img, res, ['png', 'jepg', 'jpg'])

    // Comprimir y subir archivo
    let fbLinkImg
    try {
        img = await comprimirArchivos(img, 'jpeg')
        fbLinkImg = await subirArchivoFirebase(img, 'campeonesImg/')
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
      
    const campeon = new Campeon({nombreApellido, pruebasCampeon, img: fbLinkImg})
    await campeon.save()

    res.json({campeon})
}

const campeonGet = async(req, res) => {
    const campeones = await Campeon.find().populate('pruebasCampeon', 'nombre')
    res.json({campeones})
}

const campeonPut = async(req, res) => {
    const {id} = req.params
    const {_id, ...resto} = req.body
    
    // Si cambia la imagen, subir nueva imagen
    if(req.files){
        let {img} = req.files
        validarArchivos(img, res, ['png', 'jepg', 'jpg'])
        try {
            img = await comprimirArchivos(img, 'jpeg')
            resto.img = await subirArchivoFirebase(img, 'campeonesImg/')
        } catch (error) {
            return res.status(500).json({msg: error.message})   
        }
        
    }

    const campeon = await Campeon.findByIdAndUpdate(id, resto)
    
    await borrarArchivoFirebase(campeon.img)
    
    res.json({campeon})
}

const campeonDelete = async(req, res) => {
    const {id} = req.params

    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado' })
    }

    const campeon = await Campeon.findByIdAndDelete(id)
    await borrarArchivoFirebase(campeon.img)
    
    res.json({campeon})
}

module.exports = {
    campeonPost,
    campeonPut,
    campeonDelete,
    campeonGet
}