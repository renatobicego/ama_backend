const {Club} = require('../models')

const clubPost = async (req, res) => {

    let {
        nombre, 
        email, 
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        logoImg,
        federacion_paga

    } = req.body

    const club = new Club({
        nombre, 
        email, 
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        logoImg,
        federacion_paga
    })

    //Guardar Db
    await club.save()
    res.json({
        club
    })
}

module.exports = {
    clubPost
}