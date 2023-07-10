const { borrarArchivoFirebase } = require("../../helpers")
const { Parrafo } = require("../../models")

const parrafoPost = async(req, res) => {
    const {texto, orden, imagen, titulo} = req.body
    const parrafo = new Parrafo({texto, orden})

    parrafo.imagen = imagen ? imagen : null
    parrafo.titulo = titulo ? titulo : null

    await parrafo.save()
    res.json({parrafo})
}

const parrafoPut = async(req, res) => {
    // Obtener id
    const {id} = req.params

    // Usuario no puede cambiar ni id ni orden de los parrafos
    const {_id, orden, ...resto} = req.body

    // Actualizar información
    const parrafo = await Parrafo.findByIdAndUpdate(id, resto)
    res.json({parrafo})
}

const parrafoDelete = async(req, res) => {
    // Obtener id
    const {id} = req.params

    // Actualizar información
    const parrafo = await Parrafo.findByIdAndDelete(id)

    res.json({parrafo})
}

module.exports = {
    parrafoPost,
    parrafoPut,
    parrafoDelete
}