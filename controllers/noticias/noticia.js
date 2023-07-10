const { borrarArchivoFirebase, validarArchivos, subirArchivoFirebase } = require("../helpers")
const { ImagenNoticia } = require("../models")


const NoticiaPost = async(req, res) => {
    const {
        titulo, 
        subtitulo, 
        cuerpo, 
        autor, 
        imgPortada, 
        fecha, 
        categoria
    } = req.body

    
    
}