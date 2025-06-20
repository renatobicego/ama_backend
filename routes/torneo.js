const { Router } = require("express")
const { validarCampos } = require("../middlewares/validarCampos")
const {check} = require('express-validator')
const { tieneRole } = require("../middlewares/validarRoles")
const { validarJWT } = require("../middlewares/validarJwt")
const { torneoPost, torneoGet, torneoPut, torneoDelete, torneoGetInscripcionActiva, torneoGetPorId, torneoGetResultados } = require("../controllers")
const { existeTorneoPorId } = require("../helpers")

const router = Router()

router.get('/', torneoGet)
router.get('/activos', torneoGetInscripcionActiva)
router.get('/resultados', torneoGetResultados)
router.get('/:id', torneoGetPorId)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeTorneoPorId ), 
    check('fecha', 'Fecha de nacimiento obligatoria').optional().isDate({format: 'YYYY-MM-dd'}),
    check('pruebasDisponibles', 'Ingrese al menos una prueba al torneo').optional().isArray({min: 1}),
    check('categoriasDisponibles', 'Ingrese al menos una categoria al torneo').optional().isArray({min: 1}),
    check('resultados', 'No se han podido subir los resultados').optional().isLength({min: 1}),
    check('programaHorario', 'No se ha podido subir el programa horario').optional().isLength({min: 1}),
    validarCampos
], torneoPut)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('nombre', 'Nombre obligatorio').not().isEmpty(),
    check('lugar', 'Lugar obligatorio').not().isEmpty(),
    check('fecha', 'Fecha de nacimiento obligatoria').isDate({format: 'YYYY-MM-dd'}),
    check('pruebasDisponibles', 'Ingrese al menos una prueba al torneo').isArray({min: 1}),
    check('programaHorario', 'No se ha podido subir el programa horario').optional().isLength({min: 1}),
    check('categoriasDisponibles', 'Ingrese al menos una categoria al torneo').isArray({min: 1}),
    validarCampos
], torneoPost)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeTorneoPorId ),
    validarCampos
], torneoDelete)

module.exports = router