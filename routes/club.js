const { Router } = require("express")
const { clubPost, clubGet, clubDelete, clubPut } = require("../controllers")
const { validarCampos } = require("../middlewares/validarCampos")
const {check} = require('express-validator')
const {existeEmailClub, existeClubPorId} = require('../helpers')
const { tieneRole } = require("../middlewares/validarRoles")
const { validarJWT } = require("../middlewares/validarJwt")
const { validarArchivo } = require("../middlewares/validarArchivo")

const router = Router()

router.get('/', clubGet)

router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE', 'ENTRENADOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeClubPorId ),
    check('entrenadores', 'Ingrese al menos un entrenador a cargo').optional().isArray({min: 1}),
    check('email', 'Correo no válido').optional().isEmail(),
    check('email').optional().custom(existeEmailClub),
    validarArchivo,
    validarCampos
], clubPut)

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE', 'ENTRENADOR_ROLE'),
    check('nombre', 'Nombre de club obligatorio').not().isEmpty(),
    check('ciudad', 'Ciudad/Departamento obligatorio').not().isEmpty(),
    check('entrenadores', 'Ingrese al menos un entrenador a cargo').isArray({min: 1}),
    check('entrenadores.*', 'Ingrese correctamente un entrenador').isMongoId(),
    check('email', 'Correo no válido').isEmail(),
    check('email').custom(existeEmailClub),
    validarCampos
], clubPost)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeClubPorId ),
    validarCampos
], clubDelete)

module.exports = router