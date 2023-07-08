const { PruebaAtleta } = require("../models")


const pruebaAtletaPost = async(req, res) => {
    const {atleta, prueba, marca} = req.body

    const pruebaAtleta = new PruebaAtleta({atleta, prueba, marca})
    await pruebaAtleta.save()

    res.json({pruebaAtleta})
}

const pruebaAtletaGetPorAtleta = async(req, res) => {
    const {id} = req.params
    const pruebaAtletaRegistradas = await PruebaAtleta.find({atleta: id})
                                                        .populate("prueba", "nombre")
                                                        .populate("atleta", "nombre_apellido")

    res.json({pruebaAtletaRegistradas})
}

const pruebaAtletaPut = async(req, res) => {
    const {id} = req.params
    const {_id, atleta, ...resto} = req.body

    const pruebaAtleta = await PruebaAtleta.findByIdAndUpdate(id, resto)
    res.json({pruebaAtleta})
}

module.exports = {
    pruebaAtletaPost,
    pruebaAtletaGetPorAtleta
}