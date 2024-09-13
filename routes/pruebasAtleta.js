const { Router } = require("express")
const { pruebaAtletaPost, pruebaAtletaGetPorAtleta, pruebaAtletaPut, pruebaAtletaDelete } = require("../controllers")
const { validarJWT } = require("../middlewares/validarJwt")
const { check } = require("express-validator")
const { existeUsuarioPorId, existePruebaEnUsuario, existePruebaAtleta } = require("../helpers")
const { validarCampos } = require("../middlewares/validarCampos")


const router = Router()

router.get('/:id', [
    check('id', 'Atleta no registrado').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], pruebaAtletaGetPorAtleta)

router.post('/', [
    check('atleta', 'Atleta no registrado').isMongoId(),
    check('atleta').custom(existeUsuarioPorId),
    check('prueba', 'Prueba no existente').isMongoId(),
    validarCampos
], pruebaAtletaPost)

router.put('/:id', [
 
    check('id', 'Prueba de atleta no registrada').isMongoId(),
    check('id').custom(existePruebaAtleta),
    check('prueba', 'Prueba no existente').optional().isMongoId(),
    validarCampos
], pruebaAtletaPut)

router.delete('/:id', [
    check('id', 'Prueba de atleta no registrada').isMongoId(),
    check('id').custom(existePruebaAtleta),
    validarCampos
], pruebaAtletaDelete)

module.exports = router