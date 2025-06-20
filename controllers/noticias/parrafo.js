const { borrarArchivoFirebase } = require("../../helpers")
const { Parrafo, ImagenNoticia, Noticia } = require("../../models")

const parrafoGetPorIdDeNoticia = async(req, res) => {
    // Obtener id 
    const {id} = req.params

    try {
        // Query
        const {cuerpo: parrafos}  = await Noticia.findById(id)
                                                    .populate({
                                                        path: "cuerpo",
                                                        select: ["titulo", "texto"],
                                                        populate: {
                                                        path: "imagenes",
                                                        select: ["url", "epigrafe"],
                                                        },
                                                    })
                                                    .lean()
    
        return res.json({
            parrafos
        });
        
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const parrafoPost = async(req, res) => {
    const {texto, orden, imagenes, titulo} = req.body

    try {
        const parrafo = new Parrafo({texto, orden, imagenes, titulo})
    
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
        if(parrafo.imagenes){
            const imgNoticia = await ImagenNoticia.findByIdAndDelete(parrafo.imagenes)
            await borrarArchivoFirebase(imgNoticia.url)
        }
        
    
        return res.json({parrafo})
        
    } catch (error) {
       return res.status(500).json({ msg: error.message })
    }

}

module.exports = {
    parrafoPost,
    parrafoPut,
    parrafoDelete,
    parrafoGetPorIdDeNoticia
}