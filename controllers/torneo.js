const { Torneo } = require('../models')
const { validarArchivos, subirArchivoFirebase, borrarArchivoFirebase } = require('../helpers')

const subirArchivosTorneoFirebase = async(file, ref, res) => {
    validarArchivos(file, res, ['pdf', 'docx', 'doc'])
    let linkFirebase
    try {
        linkFirebase = await subirArchivoFirebase(file, ref)
    } catch (error) {
        return res.status(500).json({msg: error})
    }
    return linkFirebase
}

const borrarArchivoTorneoFirebase = async(ref, res) => {
    try {
        await borrarArchivoFirebase(ref)
    } catch (error) {
        return res.status(500).json({ msg: error })
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
    } = req.body

    // Subir a firebase resultados si son enviados
    let resultados = ''
    if(req.files.resultados){
        resultados = await subirArchivosTorneoFirebase(req.files.resultados, 'archivos/resultadosTorneos/', res)
    }

    // Subir a firebase programa horario si son enviados
    let programaHorario = ''
    if(req.files.programaHorario){
        programaHorario = await subirArchivosTorneoFirebase(req.files.programaHorario, 'archivos/programaHorarioTorneos/', res)
    }

    const torneo = new Torneo({
        nombre, 
        fecha, 
        pruebasDisponibles, 
        categoriasDisponibles,
        resultados,
        programaHorario
    })
    
    //Guardar Db
    await torneo.save()
    res.json({
        torneo
    })
    return
}

const torneoGet = async(req, res) => {
    // Limitar resultados
    const { limite = 5, desde = 0 } = req.query;

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
    ]);

    res.json({
        total,
        torneos
    });
}

const torneoPut = async(req, res) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;

    // Subir a firebase resultados si son enviados
    if(req.files.resultados){
        resto.resultados = await subirArchivosTorneoFirebase(req.files.resultados, 'archivos/resultadosTorneos/', res)
    }

    // Subir a firebase programa horario si son enviados
    if(req.files.programaHorario){
        resto.programaHorario = await subirArchivosTorneoFirebase(req.files.programaHorario, 'archivos/programaHorarioTorneos/', res)
    }

    const torneo = await Torneo.findByIdAndUpdate( id, resto )

    // Borrar archivos anteriores si usuario lo cambia (Torneo.findByIdAndUpdate retorna valores anteriores al cambio)
    torneo.resultados & borrarArchivoTorneoFirebase(torneo.resultados, res)
    torneo.programaHorario && borrarArchivoTorneoFirebase(torneo.programaHorario, res)

    res.json(torneo)
} 

const torneoDelete = async(req, res) => {
    const { id } = req.params

    // Solo administradores pueden borrar torneos
    if (req.usuario.role !== 'ADMIN_ROLE' && req.usuario.role !== 'EDITOR_ROLE') {
        return res.status(403).json({ msg: 'Acceso denegado, solo administradores pueden borrar torneos' })
    }

    const torneo = await Torneo.findByIdAndDelete( id )

    // Borrar archivos (Torneo.findByIdAndDelete retorna valor borrado)
    torneo.resultados & borrarArchivoTorneoFirebase(torneo.resultados, res)
    torneo.programaHorario && borrarArchivoTorneoFirebase(torneo.programaHorario, res)

    res.json(torneo)
}


module.exports = {
    torneoPost,
    torneoGet,
    torneoPut,
    torneoDelete
}