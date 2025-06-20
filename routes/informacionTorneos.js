const { Router } = require("express");
const { Prueba, Categoria, Federacion, Asociacion } = require("../models");


const router = Router()

router.get('/pruebas', async(req, res) =>{ 
    const pruebas = await Prueba.find()
    res.json({pruebas})
})
router.get('/categorias', async(req, res) =>{ 
    const categorias = await Categoria.find()
    res.json({categorias})
})
router.get('/federaciones', async(req, res) =>{ 
    const federaciones = await Federacion.find()
    res.json({federaciones})
})
router.get('/asociaciones', async(req, res) =>{ 
    const asociaciones = await Asociacion.find()
    res.json({asociaciones})
})

module.exports = router