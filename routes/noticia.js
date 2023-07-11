const { Router } = require("express");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeParrafoNoticia, existeNoticia } = require("../helpers");
const { noticiaPost, noticiaPut, categoriasGet } = require("../controllers");


const router = Router()

router.get('/categorias', categoriasGet)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('subtitulo', 'Debe agregar más texto al subtítulo').isLength({min: 20}),
    check('cuerpo', 'Error al crear el orden de los párrafos').isArray({min: 1}),
    check('titulo', 'Debe agregar más texto al título').isLength({min: 10}),
    check('imgPortada', 'Error en la imagen').isMongoId(),
    check('fecha', 'Fecha incorrecta').isDate({format: 'YYYY-MM-dd'}),
    check('categoria', 'No existe la categoría seleccionada').isMongoId(),
    validarCampos

], noticiaPost)

// router.delete('/:id', [
//     validarJWT,
//     tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
//     check('id', 'Párrafo no registrado').isMongoId(),
//     check('id').custom(existeParrafoNoticia),
//     validarCampos
// ], parrafoDelete)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Párrafo no registrado').isMongoId(),
    check('id').custom(existeNoticia),
    check('subtitulo', 'Debe agregar más texto al párrafo').optional().isLength({min: 20}),
    check('titulo', 'Debe agregar más texto al título').optional().isLength({min: 10}),
    check('imgPortada', 'Error en la imagen').optional().isMongoId(),
    check('cuerpo', 'Error al crear el orden de los párrafos').isArray({min: 1}),
    validarCampos
], noticiaPut)

module.exports = router