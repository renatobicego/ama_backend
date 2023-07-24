const { borrarArchivoFirebase } = require("../../helpers")
const { Parrafo, ImagenNoticia } = require("../../models")

const parrafoPost = async(req, res) => {
    const {texto, orden, imagenes, titulo} = req.body

    try {
        const parrafo = new Parrafo({texto, orden})
    
        parrafo.imagenes = imagenes ? imagenes : []
        parrafo.titulo = titulo ? titulo : null
    
        await parrafo.save()
        return res.json({parrafo})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const parrafoPut = async(req, res) => {
    // Obtener id
    const {id} = req.params

    // Usuario no puede cambiar ni id ni orden de los parrafos
    const {_id, orden, ...resto} = req.body

    try {
        // Actualizar información
        const parrafo = await Parrafo.findByIdAndUpdate(id, resto)
        return res.json({parrafo})
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}

const parrafoDelete = async(req, res) => {
    // Obtener id
    const {id} = req.params

    try {
        // Actualizar información
        const parrafo = await Parrafo.findByIdAndDelete(id)
        if(parrafo.imagen){
            parrafo.imagen.forEach(
                async id => {
                    const imgNoticia = await ImagenNoticia.findByIdAndDelete(id)
                    await borrarArchivoFirebase(imgNoticia.url)
                }
            )
        }
        
    
        return res.json({parrafo})
        
    } catch (error) {
       return res.status(500).json({ msg: error.message })
    }

}

module.exports = {
    parrafoPost,
    parrafoPut,
    parrafoDelete
}