const { Router } = require("express");
const { campeonPost, campeonGet, campeonPut, campeonDelete, campeonGetPorId } = require("../controllers");
const { validarCampos } = require("../middlewares/validarCampos");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { existeCampeonPorId } = require("../helpers");


const router = Router()

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('nombre_apellido', 'Nombre y apellido obligatorio').notEmpty(),
    check('pruebasCampeon', 'Agregue al menos una prueba').isArray({min: 1}),
    check('img', 'No se ha podido subir la imagen correctamente').isLength({min: 3}),
    validarCampos
], campeonPost)

router.get('/', campeonGet)
router.get('/:id', campeonGetPorId)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(existeCampeonPorId),
    check('nombre_apellido', 'Nombre y apellido obligatorio').optional().notEmpty(),
    check('pruebasCampeon', 'Agregue al menos una prueba').optional().isArray({min: 1}),
    validarCampos
], campeonPut)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Id no válido').isMongoId(),
    check('id').custom(existeCampeonPorId),
    validarCampos
], campeonDelete)


module.exports = router