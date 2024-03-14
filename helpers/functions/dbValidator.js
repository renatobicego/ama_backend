const { Usuario, Role, Club, Torneo, Campeon, Inscripcion, PruebaAtleta, ImagenNoticia, Parrafo, Noticia } = require("../../models")


const existeEmail = async(email, {req}) => {
    const buscarMail = await Usuario.findOne({email})
    if(req.params.id){
        if(buscarMail._id.toString() !== req.params.id){
            throw new Error(`El correo ${email} ya está registrado`)
        }
    }else{
        if(buscarMail){
            throw new Error(`El correo ${email} ya está registrado`)
        }
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
        throw new Error(`El rol no está registrado en la BD`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El usuario no existe `);
    }
}

const existeCampeonPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCampeon = await Campeon.findById(id);
    if ( !existeCampeon ) {
        throw new Error(`El campeon  no existe `);
    }
}

const existeClubPorId = async(id) => {
    if(id !== ''){
        const existeClub = await Club.findById(id)
        if(!existeClub){
            throw new Error(`El club no existe `)
        }
    }
}

const existeTorneoPorId = async(id) => {
    const existeTorneo = await Torneo.findById(id)
    if(!existeTorneo){
        throw new Error(`El torneo con id ${ id } no existe `)
    }
}

const existeInscripcionPorId = async(id) => {
    const existeInscripcion = await Inscripcion.findById(id)
    if(!existeInscripcion){
        throw new Error(`La inscripción con id ${ id } no existe `)
    }
}

const existeInscripcionEnAtleta = async(torneo, {req}) => {
    
    const existeInscripcion = await Inscripcion.findOne({atleta: req.body.atleta, torneo})
    if(existeInscripcion){
        throw new Error(`Ya se ha inscripto a este torneo. Si necesita, edite su inscripción en Mi Perfil > Mis Inscripciones`)
    }
}

const existePruebaEnUsuario = async(id, atletaId) => {
    const existePruebaRegistradaEnUsuario = await PruebaAtleta.findOne({prueba: id, atleta: atletaId})
    if(existePruebaRegistradaEnUsuario){
        await existePruebaRegistradaEnUsuario.deleteOne()
    }
}

const existePruebaAtleta = async(id) => {
    const existePruebaAtleta = await PruebaAtleta.findById(id)
    if(!existePruebaAtleta){
        throw new Error('La prueba del atleta no se encuentra registrada')
    }
}

const existeImagenNoticia = async(id) => {
    const existeImagenNoticia = await ImagenNoticia.findById(id)
    if(!existeImagenNoticia){
        throw new Error('La imagen no se encuentra registrada')
    }
}

const existeParrafoNoticia = async(id) => {
    const existeParrafoNoticia = await Parrafo.findById(id)
    if(!existeParrafoNoticia){
        throw new Error('El párrafo no se encuentra registrado')
    }
}

const existeNoticia = async(id) => {
    const existeNoticia = await Noticia.findById(id)
    if(!existeNoticia){
        throw new Error('La noticia no se encuentra registrado')
    }
}

const existeUsuarioPorDni = async(dni, {req}) => {
    const existeUsuario = await Usuario.findOne({dni})
    
    if(req.params.id){
        if(existeUsuario._id.toString() !== req.params.id){
            throw new Error(`El usuario con DNI ${dni} se encuentra registrado`)
        }
    }else{
        if(existeUsuario){
            throw new Error(`El usuario con DNI ${dni} se encuentra registrado`)
        }
    }
}

module.exports = {
    existeEmail,
    esRoleValido,
    existeUsuarioPorId,
    existeEmailClub,
    existeClubPorId,
    existeTorneoPorId,
    existeCampeonPorId,
    existeInscripcionPorId,
    existePruebaEnUsuario,
    existePruebaAtleta,
    existeImagenNoticia,
    existeParrafoNoticia,
    existeNoticia,
    existeUsuarioPorDni,
    existeInscripcionEnAtleta
}