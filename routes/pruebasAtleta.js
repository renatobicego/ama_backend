const { Router } = require("express")
const { pruebaAtletaPost, pruebaAtletaGetPorAtleta } = require("../controllers/pruebaAtleta")
const { validarJWT } = require("../middlewares/validarJwt")
const { check } = require("express-validator")
const { existeUsuarioPorId, existePruebaEnUsuario } = require("../helpers")
const { validarCampos } = require("../middlewares/validarCampos")


const router = Router()

router.get('/:id', [
    check('id', 'Atleta no registrado').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], pruebaAtletaGetPorAtleta)

router.post('/', [
    validarJWT,
    check('atleta', 'Atleta no registrado').isMongoId(),
    check('atleta').custom(existeUsuarioPorId),
    check('prueba', 'Prueba no existente').isMongoId(),
    check('prueba').custom(existePruebaEnUsuario),
    check('marca', 'Ingrese su marca').isLength({min: 2}),
    validarCampos
], pruebaAtletaPost)

module.exports = router