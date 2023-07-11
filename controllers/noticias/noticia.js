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

    try {
        const noticia = new Noticia({
            titulo, subtitulo, cuerpo, imgPortada, fecha, categoria, autor: req.usuario._id
        })
    
        await noticia.save()
        return res.json({noticia})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

    
}

const noticiaPut = async(req, res) => {
    // Obtener id
    const {id} = req.params
    // Obtener datos de noticia
    const {_id, autor, ...resto} = req.body

    try {
        // Actualizar noticia
        const noticia = await Noticia.findByIdAndUpdate(id, resto)
        return res.json({noticia})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }


}

const noticiaGet = async(req, res) => {
    // Limitar respuesta
    const { limite = 10, desde = 0 } = req.query

    try {
        // Query
        const [ total, noticias ] = await Promise.all([
            Noticia.countDocuments(),
            Noticia.find()
                .skip( Number( desde ) )
                .limit(Number( limite ))
                .populate("imgPortada", "url")
                .populate("categoria", "nombre")
                .lean()
        ]);
    
        return res.json({
            total,
            noticias
        });
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}


const categoriasGet = async(req, res) => {
    const categorias = await CategoriaNoticia.find()
    return res.json({categorias})
}

const deleteImagenNoticia = async(id) => {
    const imgNoticia = await ImagenNoticia.findByIdAndDelete(id)
    try {
        await borrarArchivoFirebase(imgNoticia.url)
    } catch (error) {
        throw new Error(error.message)
    }
}
 
const noticiaDelete = async(req, res) => {
    // Obtener id de noticia
    const {id} = req.params

    try {
        // Borrar noticia
        const noticia = await Noticia.findByIdAndDelete(id)
    
        // Borrar párrafos
        const arrParrafos = noticia.cuerpo
        arrParrafos.forEach(async parrafo => {
            const parrafoBorrado = await Parrafo.findByIdAndDelete(parrafo._id)
            // Borrar imagen si tiene
            if(parrafoBorrado.imagen){
                parrafoBorrado.imagen.forEach(
                    async id => await deleteImagenNoticia(id, res)
                )
            }
        })
     
        //Borrar imagen de portada
        await deleteImagenNoticia(noticia.imgPortada)
    
        return res.json({noticia})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}

module.exports = {
    noticiaPost,
    noticiaPut,
    categoriasGet,
    noticiaGet,
    noticiaDelete
}