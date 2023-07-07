const {Inscripcion} = require("../models")


const inscripcionPost = async(req, res) => {
    const {torneo, atleta, pruebasInscripto, categoria} = req.body

    if(atleta._id !== req.usuario._id && req.usuario.role === 'USER_ROLE'){
        return res.status(403).json({msg: 'Acceso denegado, solo entrenadores púeden inscribir a otros atletas'})
    }

    const inscripcion = new Inscripcion({torneo, atleta, pruebasInscripto, categoria})
    await inscripcion.save()
    res.json({inscripcion})
}

module.exports = {
    inscripcionPost
}