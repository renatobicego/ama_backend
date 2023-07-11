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

const noticiaGet = async(req, res) => {
    // Limitar respuesta
    const { limite = 10, desde = 0 } = req.query;

    // Query
    const [ total, noticias ] = await Promise.all([
        Noticia.countDocuments(),
        Noticia.find()
            .skip( Number( desde ) )
            .limit(Number( limite ))
            .populate("imgPortada", "url")
            .populate("categoria", "nombre")
    ]);

    res.json({
        total,
        noticias
    });
}


const categoriasGet = async(req, res) => {
    const categorias = await CategoriaNoticia.find()
    res.json({categorias})
}

const deleteImagenNoticia = async(id) => {
    const imgNoticia = await ImagenNoticia.findById(id)
    await borrarArchivoFirebase(imgNoticia.url)
    await imgNoticia.remove()
}

const noticiaDelete = async(req, res) => {
    // Obtener id de noticia
    const {id} = req.params

    // Borrar noticia
    const noticia = await Noticia.findByIdAndDelete(id)

    // Borrar párrafos
    const arrParrafos = noticia.cuerpo
    arrParrafos.forEach(async parrafo => {
        const parrafoBorrado = await Parrafo.findByIdAndDelete(parrafo._id)
        // Borrar imagen si tiene
        if(parrafoBorrado.imagen){
            await deleteImagenNoticia(parrafoBorrado.imagen)
        }
    })
 
    //Borrar imagen de portada
    await deleteImagenNoticia(noticia.imgPortada)

    res.json({noticia})
}

module.exports = {
    noticiaPost,
    noticiaPut,
    categoriasGet,
    noticiaGet,
    noticiaDelete
}