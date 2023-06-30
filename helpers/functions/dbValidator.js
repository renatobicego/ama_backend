const { Usuario } = require("../../models")


const existeEmail = async(correo) => {
    const buscarMail = await Usuario.findOne({correo})
    if(buscarMail){
        throw new Error(`El correo ${correo} ya está registrado`)
    }
} 

module.exports = {
    existeEmail
}