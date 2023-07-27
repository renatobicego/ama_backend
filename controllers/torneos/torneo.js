const { Torneo } = require('../../models')
const { borrarArchivoFirebase } = require('../../helpers')

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
        lugar,
        programaHorario,
        cantidadDias
    } = req.body

    try {
    
        const torneo = new Torneo({
            nombre, 
            fecha, 
            lugar,
            pruebasDisponibles, 
            categoriasDisponibles,
            programaHorario,
            cantidadDias
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

const torneoGetResultados = async(req, res) => {
    // Limitar resultados
    const { limite = 5, desde = 0 } = req.query;

    try {
        // Query
        const [ total, torneos ] = await Promise.all([
            Torneo.countDocuments({inscripcionesAbiertas: false}),
            Torneo.find({inscripcionesAbiertas: false})
                .skip( Number( desde ) )
                .limit(Number( limite ))
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

const torneoGetPorId = async(req, res) => {
    // Limitar resultados
    const {id} = req.params

    try {
        // Query
        const torneo = await 
            Torneo.findById(id)
                .populate({
                    path: "pruebasDisponibles",
                    select: [
                      "nombre", 
                      "tipo"
                    ],
                    populate: 
                      {
                        path: "categorias",
                        select: ["nombre"],
                      },
                    })
                .populate("categoriasDisponibles", "nombre")
                .lean()
    
        return res.json({
            torneo
        })
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const torneoGetInscripcionActiva = async(req, res) => {

    try {
        // Query
        const [ total, torneos ] = await Promise.all([
            Torneo.countDocuments({inscripcionesAbiertas: true}),
            Torneo.find({inscripcionesAbiertas: true})
                .populate({
                    path: "pruebasDisponibles",
                    select: [
                    "nombre", 
                    "tipo"
                    ],
                    populate: 
                    {
                        path: "categorias",
                        select: ["nombre"],
                    },
                    })
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
    const {programaHorario, resultados} = req.body

    try {
    
        const torneo = await Torneo.findByIdAndUpdate( id, resto )
        if(resultados) torneo.resultados.length > 0 && await borrarArchivoTorneoFirebase(torneo.resultados)
        if(programaHorario) torneo.programaHorario.length > 0 && await borrarArchivoTorneoFirebase(torneo.programaHorario)
        
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
        torneo.resultados.length > 0 && await borrarArchivoTorneoFirebase(torneo.resultados)
        torneo.programaHorario.length > 0 && await borrarArchivoTorneoFirebase(torneo.programaHorario)
    
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
    torneoDelete,
    torneoGetPorId,
    torneoGetResultados
}