const { borrarArchivoFirebase, validarArchivos, subirArchivoFirebase } = require("../../helpers")
const { ImagenNoticia, Parrafo, Noticia } = require("../../models")


const NoticiaPost = async(req, res) => {
    // Obtener datos de noticia
    const {
        titulo, 
        subtitulo, 
        cuerpo,  
        imgPortada, 
        fecha, 
        categoria
    } = req.body

    // Subir parrafos a db
    let parrafosId = []

    await Promise.all(cuerpo.forEach(async parrafo => {
        const parrafoDB = new Parrafo({
            texto: parrafo.texto,
            orden: parrafo.orden
        })
        parrafoDB.imagen = parrafo.imagen ? parrafo.imagen : null
        parrafoDB.titulo = parrafo.titulo ? parrafo.titulo : null

        await parrafoDB.save()
        parrafosId.push(parrafoDB._id)
    }))

    const noticia = new Noticia({
        titulo, subtitulo, cuerpo: parrafosId, imgPortada, fecha, categoria, autor: req.usuario._id
    })

    await noticia.save()
    res.json({noticia})
    
}

const NoticiaPut = async(req, res) => {
    // Obtener id
    const {id} = req.params
    // Obtener datos de noticia
    const {_id, autor, ...resto} = req.body

    // Actualizar noticia
    const noticia = await Noticia.findByIdAndUpdate(id, resto)
    res.json({noticia})

}