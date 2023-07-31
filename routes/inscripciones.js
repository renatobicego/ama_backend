const { Router } = require("express");
const { validarJWT } = require("../middlewares/validarJwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeUsuarioPorId, existeTorneoPorId, existeInscripcionPorId, existeInscripcionEnAtleta } = require("../helpers");
const { inscripcionPost, inscripcionGetPorTorneo, inscripcionGetPorAtleta, inscripcionGetPorClub, inscripcionPut, inscripcionDelete, inscripcionGetPorId } = require("../controllers");


const router = Router()

router.get('/torneo/:idTorneo', inscripcionGetPorTorneo)
router.get('/atleta', [validarJWT, validarCampos],inscripcionGetPorAtleta)
router.get('/club/:idClub', inscripcionGetPorClub)
router.get('/:id', [
    check('id', 'Inscripción no registrada').isMongoId(),
    check('id').custom(existeInscripcionPorId),
    validarCampos
], inscripcionGetPorId)

router.post('/', [
    validarJWT,
    check('atleta', 'Atleta no está registrado').isMongoId(),
    check('atleta').custom(existeUsuarioPorId),
    check('torneo', 'Torneo no está registrado').isMongoId(),
    check('torneo').custom(existeTorneoPorId),
    check('torneo').custom(existeInscripcionEnAtleta),
    check('categoria', 'Categoría no está registrada').isMongoId(),
    check('pruebasInscripto', 'Elija al menos una prueba para inscribirse').isArray({min: 1}),
    validarCampos
], inscripcionPost)

router.put('/:id', [
    validarJWT,
    check('id', 'Inscripción no registrada').isMongoId(),
    check('id').custom(existeInscripcionPorId),
    check('pruebasInscripto', 'Elija al menos una prueba para inscribirse').optional().isArray({min: 1}),
    validarCampos
], inscripcionPut)

router.delete('/:id', [
    validarJWT,
    check('id', 'Inscripción no registrada').isMongoId(),
    check('id').custom(existeInscripcionPorId),
    validarCampos
], inscripcionDelete)


module.exports = router