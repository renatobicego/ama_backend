const { Torneo } = require('../../models')
const { validarArchivos, subirArchivoFirebase, borrarArchivoFirebase } = require('../../helpers')

const subirArchivosTorneoFirebase = async(file, ref) => {
    
    let linkFirebase
    try {
        linkFirebase = await subirArchivoFirebase(file, ref)
    } catch (error) {
        throw new Error(error)
    }
    return linkFirebase
}

const borrarArchivoTorneoFirebase = async(ref) => {
    try {
        await borrarArchivoFirebase(ref)
    } catch (error) {
        throw new Error(error)
    }
}

const torneoPost = async (req, res) => {

    // Selecciono cada variable que quiero guardar para evitar 
    // guardar datos mandados en body erroneamente

    let {
        nombre, 
        fecha, 
        pruebasDisponibles, 
        categoriasDisponibles, 
        lugar
    } = req.body

    try {
    
        const torneo = new Torneo({
            nombre, 
            fecha, 
            lugar,
            pruebasDisponibles, 
            categoriasDisponibles,
        })
        
        //Guardar Db
        await torneo.save()
        return res.json({
            torneo
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const torneoGet = async(req, res) => {
    // Limitar resultados
    const { limite = 5, desde = 0 } = req.query;

    try {
        // Query
        const [ total, torneos ] = await Promise.all([
            Torneo.countDocuments(),
            Torneo.find()
                .skip( Number( desde ) )
                .limit(Number( limite ))
                .populate("pruebasDisponibles", "nombre")
                .populate("categoriasDisponibles", "nombre")
                // Ordenar por fecha
                .sort({fecha: 'desc'})
                .lean()
        ]);
    
        return res.json({
            total,
            torneos
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const torneoGetInscripcionActiva = async(req, res) => {

    try {
        // Query
        const [ total, torneos ] = await Promise.all([
            Torneo.countDocuments(),
            Torneo.find({inscripcionesAbiertas: true})
                .populate("pruebasDisponibles", "nombre")
                .populate("categoriasDisponibles", "nombre")
                // Ordenar por fecha
                .sort({fecha: 'asc'})
                .lean()
        ]);
    
        return res.json({
            total,
            torneos
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }

}

const torneoPut = async(req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body

    try {
        // Subir a firebase resultados y programa horario si son enviados
        if(req.files){
            const {resultados, programaHorario} = req.files
            if(resultados){
                // Validar tamaño y extensión
                const msg = validarArchivos(resultados, ['pdf', 'docx', 'doc'])
                if(msg){
                    return res.status(401).json({msg})
                }
                resto.resultados = await subirArchivosTorneoFirebase(resultados, 'archivos/resultadosTorneos/', res)
            }
            if(programaHorario){
                // Validar tamaño y extensión
                const msg = validarArchivos(programaHorario, ['pdf', 'docx', 'doc'])
                if(msg){
                    return res.status(401).json({msg})
                }
                resto.programaHorario = await subirArchivosTorneoFirebase(programaHorario, 'archivos/programaHorarioTorneos/', res)
            }
        }
    
        const torneo = await Torneo.findByIdAndUpdate( id, resto )
    
        // Borrar archivos anteriores si usuario lo cambia (Torneo.findByIdAndUpdate retorna valores anteriores al cambio)
        torneo.resultados && await borrarArchivoTorneoFirebase(torneo.resultados, res)
        torneo.programaHorario && await borrarArchivoTorneoFirebase(torneo.programaHorario, res)
    
        return res.json(torneo)
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
} 

const torneoDelete = async(req, res) => {
    const { id } = req.params

    // Solo administradores pueden borrar torneos
    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar torneos' })
    }

    try {
        const torneo = await Torneo.findByIdAndDelete( id )
    
        // Borrar archivos (Torneo.findByIdAndDelete retorna valor borrado)
        torneo.resultados && await borrarArchivoTorneoFirebase(torneo.resultados)
        torneo.programaHorario && await borrarArchivoTorneoFirebase(torneo.programaHorario)
    
        return res.json(torneo)
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
        
    }
}


module.exports = {
    torneoPost,
    torneoGet,
    torneoGetInscripcionActiva,
    torneoPut,
    torneoDelete
}