const { subirArchivoFirebase, borrarArchivoFirebase, validarArchivos } = require("../../helpers")
const comprimirArchivos = require("../../helpers/functions/comprimirArchivos")
const { ImagenNoticia } = require("../../models")

const subirArchivosNoticiaFirebase = async(file, ref, res) => {
    let linkFirebase
    try {
        file = await comprimirArchivos(file, 'jpg')
        linkFirebase = await subirArchivoFirebase(file, ref)
    } catch (error) {
        throw new Error(error)
    }
    return linkFirebase
}

const borrarArchivoNoticiaFirebase = async(ref) => {
    try {
        await borrarArchivoFirebase(ref)
    } catch (error) {
        throw new Error(error)
    }
}


const imagenNoticiaPost = async(req, res) => {
    // Obtener epigrafe e imagen
    const {epigrafe} = req.body
    const {imagen} = req.files

    // Validar tamaño y extensión
    const {msg}= validarArchivos(imagen, ['png', 'jpg', 'jpeg'])
    if(msg){
        return res.status(401).json({msg})
    }

    try {
        // SUbir imagen a firebase
        const linkFirebase = await subirArchivosNoticiaFirebase(imagen, 'images/noticias/')
        //Crear imagen con epigrafe en la db
        const imgPortada = new ImagenNoticia({url: linkFirebase, epigrafe})
        await imgPortada.save()
    
        return res.json({imgPortada})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const imagenNoticiaDelete = async(req, res) => {
    //Obtener id
    const {id} = req.params

    try {
        // Eliminar en la db
        const imgPortada = await ImagenNoticia.findByIdAndDelete(id)
    
        //Eliminar imagen de firebase
        await borrarArchivoNoticiaFirebase(imgPortada.url)
    
        return res.json({imgPortada})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}

const imagenNoticiaPut = async(req, res) => {
    //Obtener id
    const {id} = req.params
    const {epigrafe} = req.body

    try {
        // Obtener imagen de noticia
        const imgNoticia = await ImagenNoticia.findById(id)
    
        //Acualizar datos si existen
        if(req.files){
            const {imagen} = req.files

            // Validar extension y tamaño
            const msg = validarArchivos(imagen, ['png', 'jpg', 'jpeg'])
            if(msg){
                return res.status(401).json({msg})
            }

            await borrarArchivoNoticiaFirebase(imgNoticia.url)
            imgNoticia.url = await subirArchivosNoticiaFirebase(imagen, 'images/noticias/')
        }
        imgNoticia.epigrafe = epigrafe ? epigrafe : imgNoticia.epigrafe
    
        await imgNoticia.save()
        return res.json({imgNoticia})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}

module.exports = {
    imagenNoticiaPost,
    imagenNoticiaDelete,
    imagenNoticiaPut
}