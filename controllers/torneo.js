const bcrypt = require('bcryptjs')
const { Torneo } = require('../models')

const torneoPost = async (req, res) => {

    // Selecciono cada variable que quiero guardar para evitar 
    // guardar datos mandados en body erroneamente

    let {
        nombre_apellido, 
        email, 
        password, 
        role, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club,
        pruebasFavoritas
    } = req.body

    const usuario = new Torneo({
        nombre_apellido, 
        email, 
        password, 
        role, 
        federacion_paga,
        fecha_nacimiento,
        telefono,
        dni,
        federacion,
        asociacion,
        club
    })

    // Guardar pruebas favoritas
    let pruebasArr = []
    if(pruebasFavoritas.length > 0){
        pruebasArr = await Promise.all(pruebasFavoritas.map(async (prueba) => {
            const {marca, prueba: pruebaId} = prueba
            const pruebaAtleta = new PruebaAtleta({marca, atleta: usuario._id, prueba: pruebaId})
            await pruebaAtleta.save()
            return pruebaAtleta._id
        }))
        usuario.pruebasFavoritas = pruebasArr
    }

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    //Guardar Db
    await usuario.save()
    res.json({
        usuario
    })
}