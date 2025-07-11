const { Router } = require("express");
const { imagenNoticiaPost, imagenNoticiaDelete, imagenNoticiaPut } = require("../controllers/noticias");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeImagenNoticia } = require("../helpers");


const router = Router()

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('url', 'La imagen no pudo subirse correctamente').isLength({min: 3}),
    validarCampos

], imagenNoticiaPost)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Imagen no registrada').isMongoId(),
    check('id').custom(existeImagenNoticia),
    validarCampos
], imagenNoticiaDelete)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Imagen no registrada').isMongoId(),
    check('id').custom(existeImagenNoticia),
    check('url', 'La imagen no pudo subirse correctamente').optional().isLength({min: 3}),
    validarCampos
], imagenNoticiaPut)

module.exports = router