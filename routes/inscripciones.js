const { Router } = require("express");
const { validarJWT } = require("../middlewares/validarJwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeUsuarioPorId, existeTorneoPorId } = require("../helpers");
const { inscripcionPost } = require("../controllers");


const router = Router()

router.post('/', [
    validarJWT,
    check('atleta', 'Atleta no está registrado').isMongoId(),
    check('atleta').custom(existeUsuarioPorId),
    check('torneo', 'Torneo no está registrado').isMongoId(),
    check('torneo').custom(existeTorneoPorId),
    check('categoria', 'Categoría no está registrada').isMongoId(),
    check('pruebasInscripto', 'Elija al menos una prueba para inscribirse').isArray({min: 1}),
    validarCampos
], inscripcionPost)


module.exports = router