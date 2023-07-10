const { borrarArchivoFirebase, validarArchivos, subirArchivoFirebase } = require("../../helpers")
const { ImagenNoticia, Parrafo, Noticia } = require("../../models")


const noticiaPost = async(req, res) => {
    // Obtener datos de noticia
    const {
        titulo, 
        subtitulo, 
        cuerpo,  
        imgPortada, 
        fecha, 
        categoria
    } = req.body


    const noticia = new Noticia({
        titulo, subtitulo, cuerpo, imgPortada, fecha, categoria, autor: req.usuario._id
    })

    await noticia.save()
    res.json({noticia})
    
}

const noticiaPut = async(req, res) => {
    // Obtener id
    const {id} = req.params
    // Obtener datos de noticia
    const {_id, autor, ...resto} = req.body

    // Actualizar noticia
    const noticia = await Noticia.findByIdAndUpdate(id, resto)
    res.json({noticia})

}

module.exports = {
    noticiaPost,
    noticiaPut
}