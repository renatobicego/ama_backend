const { Router } = require("express");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { existeParrafoNoticia, existeNoticia } = require("../helpers");
const { noticiaPost, noticiaPut, noticiaGet, categoriasGet, noticiaDelete, noticiaGetPorId, noticiaGetPorCategoria } = require("../controllers");


const router = Router()

router.get('/', noticiaGet)
router.get('/:id', [
    check('id', 'Noticia no registrada').isMongoId(),
    check('id').custom(existeNoticia),
    validarCampos
], noticiaGetPorId)

router.get('/categorias', categoriasGet)
router.get('/noticias_recomendadas/:id', [
    check('id', 'Categoría no registrada').isMongoId(),
    validarCampos
], noticiaGetPorCategoria)

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

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Noticia no registrada').isMongoId(),
    check('id').custom(existeNoticia),
    validarCampos
], noticiaDelete)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'Noticia no registrada').isMongoId(),
    check('id').custom(existeNoticia),
    check('subtitulo', 'Debe agregar más texto al párrafo').optional().isLength({min: 20}),
    check('titulo', 'Debe agregar más texto al título').optional().isLength({min: 10}),
    check('imgPortada', 'Error en la imagen').optional().isMongoId(),
    check('fecha', 'Fecha incorrecta').optional().isDate({format: 'YYYY-MM-dd'}),
    check('categoria', 'No existe la categoría seleccionada').optional().isMongoId(),
    validarCampos
], noticiaPut)

module.exports = router