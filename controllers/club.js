const { subirArchivoFirebase } = require('../helpers/functions/archivosFirebase')
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
        federacion_paga

    } = req.body

    const {logoImg} = req.files

    const fbLinkImage = await subirArchivoFirebase(logoImg, 'images/clubes/' + logoImg.name)

    const club = new Club({
        nombre, 
        email, 
        ciudad, 
        entrenadores, 
        instagram,
        facebook,
        twitter,
        federacion_paga,
        logoImg: fbLinkImage
    })

    //Guardar Db
    await club.save()
    res.json({
        club
    })
}

const clubGet = async(req, res) => {

    const [ total, clubes ] = await Promise.all([
        Club.countDocuments(),
        Club.find()
            .populate("entrenadores", ["nombre_apellido", "telefono"])
    ]);

    res.json({
        total,
        clubes
    });
}

module.exports = {
    clubPost,
    clubGet
}