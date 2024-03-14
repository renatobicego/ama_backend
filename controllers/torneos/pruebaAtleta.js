const { PruebaAtleta } = require("../../models")


const pruebaAtletaPost = async(req, res) => {
    let {atleta, prueba, marca} = req.body

    // Si marca no está presente en el cuerpo de la solicitud, establecerla como null.
    marca = marca || null;
    try {
        const pruebaAtleta = new PruebaAtleta({atleta, prueba, marca})
        await pruebaAtleta.save()
        res.json({pruebaAtleta})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const pruebaAtletaGetPorAtleta = async(req, res) => {
    const {id} = req.params
    try {
        const pruebaAtletaRegistradas = await PruebaAtleta.find({atleta: id})
                                                            .populate("prueba", "nombre")
                                                            .populate("atleta", "nombre_apellido")
                                                            .lean()
    
        res.json({pruebaAtletaRegistradas})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

const pruebaAtletaPut = async(req, res) => {
    const {id} = req.params
    const {_id, atleta, ...resto} = req.body

    try {
        const pruebaAtleta = await PruebaAtleta.findByIdAndUpdate(id, resto)
        res.json({pruebaAtleta})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }

}

const pruebaAtletaDelete = async(req, res) => {
    const {id} = req.params

    try {
        const pruebaAtleta = await PruebaAtleta.findByIdAndDelete(id)
    
        res.json({pruebaAtleta})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

module.exports = {
    pruebaAtletaPost,
    pruebaAtletaGetPorAtleta,
    pruebaAtletaPut,
    pruebaAtletaDelete
}