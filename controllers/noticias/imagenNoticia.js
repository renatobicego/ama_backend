const {  borrarArchivoFirebase } = require("../../helpers")
const { ImagenNoticia } = require("../../models")

const borrarArchivoNoticiaFirebase = async(ref) => {
    try {
        await borrarArchivoFirebase(ref)
    } catch (error) {
        throw new Error(error)
    }
}


const imagenNoticiaPost = async(req, res) => {
    // Obtener epigrafe e imagen
    const {epigrafe, url} = req.body

    try {
        //Crear imagen con epigrafe en la db
        const imgPortada = new ImagenNoticia({url, epigrafe})
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
    const {_id, ...resto} = req.body

    try {
        // Obtener imagen de noticia
        const imgNoticia = await ImagenNoticia.findByIdAndUpdate(id)
    
        //Acualizar datos si existen
        if(resto.url){
            await borrarArchivoNoticiaFirebase(imgNoticia.url)
        }

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