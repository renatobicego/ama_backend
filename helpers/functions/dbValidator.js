const { Usuario, Role, Club, Torneo } = require("../../models")


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

const existeClubPorId = async(id) => {
    const existeClub = await Club.findById(id)
    if(!existeClub){
        throw new Error(`El club con id ${ id } no existe `)
    }
}

const existeTorneoPorId = async(id) => {
    const existeTorneo = await Torneo.findById(id)
    if(!existeTorneo){
        throw new Error(`El torneo con id ${ id } no existe `)
    }
}



module.exports = {
    existeEmail,
    esRoleValido,
    existeUsuarioPorId,
    existeEmailClub,
    existeClubPorId,
    existeTorneoPorId
}