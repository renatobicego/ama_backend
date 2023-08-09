const { Router } = require("express");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeParrafoNoticia, existeNoticia } = require("../helpers");
const { parrafoPost, parrafoDelete, parrafoPut, parrafoGetPorIdDeNoticia } = require("../controllers");


const router = Router()

router.get('/:id', [check('id').custom(existeNoticia), validarCampos], parrafoGetPorIdDeNoticia)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('texto', 'Debe agregar más texto al párrafo').isLength({min: 10}),
    check('titulo', 'Debe agregar más texto al título').optional().isLength({min: 1}),
    check('imagenes', 'No se han podido subir correctamente las imagenes').optional().isMongoId(),
    validarCampos

], parrafoPost)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Párrafo no registrado').isMongoId(),
    check('id').custom(existeParrafoNoticia),
    validarCampos
], parrafoDelete)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Párrafo no registrado').isMongoId(),
    check('id').custom(existeParrafoNoticia),
    check('texto', 'Debe agregar más texto al párrafo').optional().isLength({min: 20}),
    check('titulo', 'Debe agregar más texto al título').optional().isLength({min: 10}),
    check('imagenes', 'La imagen no se ha podido subir').optional().isMongoId(),
    validarCampos
], parrafoPut)

module.exports = router