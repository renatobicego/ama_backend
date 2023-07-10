const { subirArchivoFirebase, borrarArchivoFirebase } = require("../../helpers")
const { ImagenNoticia } = require("../../models")

const subirArchivosNoticiaFirebase = async(file, ref, res) => {
    validarArchivos(file, res, ['png', 'jpg', 'jpeg'])
    let linkFirebase
    try {
        linkFirebase = await subirArchivoFirebase(file, ref)
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
    return linkFirebase
}

const borrarArchivoNoticiaFirebase = async(ref, res) => {
    try {
        await borrarArchivoFirebase(ref)
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}


const imagenNoticiaPost = async(req, res) => {
    // Obtener epigrafe e imagen
    const {epigrafe} = req.body
    const {imagen} = req.files

    // SUbir imagen a firebase
    const linkFirebase = await subirArchivosNoticiaFirebase(imagen, '/noticias/images/', res)

    //Crear imagen con epigrafe en la db
    const imgPortada = new ImagenNoticia({url: linkFirebase, epigrafe})
    await imgPortada.save()

    res.json({imgPortada})
}

const imagenNoticiaDelete = async(req, res) => {
    //Obtener id
    const {id} = req.params

    // Eliminar en la db
    const imgPortada = await ImagenNoticia.findByIdAndDelete(id)

    //Eliminar imagen de firebase
    await borrarArchivoNoticiaFirebase(imgPortada.url, res)

    res.json({imgPortada})
}

const imagenNoticiaPut = async(req, res) => {
    //Obtener id
    const {id} = req.params
    const {epigrafe} = req.body
    const {imagen} = req.files

    // Obtener imagen de noticia
    const imgNoticia = await ImagenNoticia.findById(id)

    //Acualizar datos si existen
    if(req.files){
        await borrarArchivoNoticiaFirebase(imgNoticia.url, res)
        imgNoticia.url = await subirArchivosNoticiaFirebase(imagen, '/noticias/images/', res)
    }
    imgNoticia.epigrafe = epigrafe ? epigrafe : imgNoticia.epigrafe

    await imgNoticia.save()
    res.json({imgNoticia})
}

module.exports = {
    imagenNoticiaPost,
    imagenNoticiaDelete,
    imagenNoticiaPut
}