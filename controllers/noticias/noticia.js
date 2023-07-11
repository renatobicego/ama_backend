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

const noticiaDelete = async(req, res) => {
    const {id} = req.params
    
}

const categoriasGet = async(req, res) => {
    const categorias = await CategoriaNoticia.find()
    res.json({categorias})
}

const noticiaDelete = async(req, res) => {
    // Obtener id de noticia
    const {id} = req.params

    const noticia = await Noticia.findByIdAndDelete(id)
    const arrParrafos = noticia.
}

module.exports = {
    noticiaPost,
    noticiaPut
}