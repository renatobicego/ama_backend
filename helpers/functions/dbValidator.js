const { Usuario, Role, Club } = require("../../models")


const existeEmail = async(email) => {
    const buscarMail = await Usuario.findOne({email})
    if(buscarMail){
        throw new Error(`El correo ${email} ya está registrado`)
    }
} 

const existeEmailClub = async(email) => {
    const buscarMail = await Club.findOne({email})
    if(buscarMail){
        throw new Error(`El club con correo ${email} ya está registrado`)
    }
}

const esRoleValido = async(role = '') => {

    const existeRole = await Role.findOne({ role });
    if ( !existeRole ) {
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El usuario con id ${ id } no existe `);
    }
}



module.exports = {
    existeEmail,
    esRoleValido,
    existeUsuarioPorId,
    existeEmailClub
}