const { AsyncParser } = require("json2csv")
const {Inscripcion} = require("../../models")
const inscripcionesCsvParser = require("../../helpers/functions/inscripcionesCsvParser")


const inscripcionPost = async(req, res) => {
    // Obtener solo variables necesarias
    const {torneo, atleta, pruebasInscripto, categoria} = req.body

    // Verificar que la inscripción sea al mismo usuario
    if(atleta._id !== req.usuario._id && req.usuario.role === 'USER_ROLE'){
        return res.status(403).json({msg: 'Acceso denegado, solo entrenadores púeden inscribir a otros atletas'})
    }

    try {
      const inscripcion = new Inscripcion({torneo, atleta, pruebasInscripto, categoria})
      await inscripcion.save()
      return res.json({inscripcion})
      
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const inscripcionGetPorTorneo = async(req, res) => {
    // Obtener id de torneo
    const {idTorneo} = req.params

    try {
      const [total, inscripciones] = await Promise.all([
          Inscripcion.countDocuments(),
          Inscripcion.find({torneo: idTorneo})
              .populate("torneo", "nombre")
              .populate({
                path: "atleta",
                select: [
                  "nombre_apellido", 
                  "fecha_nacimiento",
                  "dni",
                  "pais",
                  "sexo",
                ],
                populate: [
                  {
                    path: "federacion",
                    select: ["siglas"],
                  },
                  {
                    path: "asociacion",
                    select: ["siglas"],
                  },
                  {
                    path: "club",
                    select: ["siglas"],
                  },
                ],
              })
              .populate("categoria", "nombre")
              // Mostrar las pruebas inscripto junto a la marca
              .populate({
                  path: "pruebasInscripto",
                  select: ["marca"],
                  populate: {
                    path: "prueba",
                    select: ["nombre"],
                  },
                })
              .lean()
      ])

      const csv = await inscripcionesCsvParser(inscripciones)

      res.setHeader('Content-disposition', 'attachment; filename=inscripciones.csv')
      res.set('Content-Type', 'text/csv')
  
      return res.send(csv)
      
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }

}

const inscripcionGetPorAtleta = async(req, res) => {
    // Obetenr id del usuario que realiza la petición
    const {_id} = req.usuario

    try {
      const [total, inscripciones] = await Promise.all([
          Inscripcion.countDocuments(),
          Inscripcion.find({atleta: _id})
              // Solo torneos con inscripción abierta
              .populate({
                  path: "torneo",
                  select: ["nombre"],
                  match: { inscripcionesAbiertas: true } 
              })
              .populate("atleta", "nombre_apellido")
              .populate("categoria", "nombre")
              // Mostrar peuebas con marca
              .populate({
                  path: "pruebasInscripto",
                  select: ["marca"],
                  populate: {
                    path: "prueba",
                    select: ["nombre"],
                  },
                })
              .lean()
      ])
  
      const inscripcionesPorAtleta = inscripciones.filter(
          (inscripcion) => inscripcion.torneo !== null
        )
  
      return res.json({total, inscripcionesPorAtleta})
      
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }

}

const inscripcionGetPorId= async(req, res) => {
  // Obetenr id del usuario que realiza la petición
  const {id} = req.params

  try {
    const inscripcion = await Inscripcion.findById(id)
            // Solo torneos con inscripción abierta
            .populate({
                path: "torneo",
                select: ["nombre"]
            })
            .populate("atleta", "nombre_apellido")
            .populate("categoria", "nombre")
            // Mostrar peuebas con marca
            .populate({
                path: "pruebasInscripto",
                select: ["marca"],
                populate: {
                  path: "prueba",
                  select: ["nombre", "tipo"],
                },
              })
            .lean()

    return res.json({inscripcion})
    
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }

}

const inscripcionGetPorClub= async(req, res) => {
    // Obtener id de club
    const {idClub} = req.params

    try {
      const [total, inscripciones] = await Promise.all([
          Inscripcion.countDocuments(),
          Inscripcion.find()
              // Torneos con inscripción abierta
              .populate({
                  path: "torneo",
                  select: ["nombre"],
                  match: { inscripcionesAbiertas: true } 
                })
              // Matchear con id de club
              .populate({
                  path: "atleta",
                  select: ["nombre_apellido"],
                  match: { club: idClub } 
                })
              .populate("atleta", "nombre_apellido")
              .populate("categoria", "nombre")
              .populate({
                  path: "pruebasInscripto",
                  select: ["marca"],
                  populate: {
                    path: "prueba",
                    select: ["nombre"],
                  },
                })
              .lean()
      ])
  
      const inscripcionesPorClub = inscripciones.filter(
          (inscripcion) => inscripcion.atleta !== null && inscripcion.torneo !== null
        )
  
      return res.json({total, inscripcionesPorClub})
      
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }

}

const inscripcionPut = async(req, res) => {
    // Obtener id de inscripcion
    const {id} = req.params
    
    // Usuario no puede cambiar el torneo ni el usuario de la inscripción
    const {_id, torneo, atleta, categoria, ...resto} = req.body

    try {
      const inscripcion = await Inscripcion.findByIdAndUpdate(id, resto)
  
      return res.json({inscripcion})
      
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }

}

const inscripcionDelete = async(req, res) => {
    // Obtener id de inscripcion
    const {id} = req.params

    try {
      const inscripcion = await Inscripcion.findByIdAndDelete(id)
  
      return res.json({inscripcion})
      
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
}



module.exports = {
    inscripcionPost,
    inscripcionGetPorTorneo,
    inscripcionGetPorAtleta,
    inscripcionGetPorClub,
    inscripcionPut,
    inscripcionDelete,
    inscripcionGetPorId
}