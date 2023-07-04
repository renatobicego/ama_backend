const { Router } = require("express")
const { clubPost, clubGet, clubDelete, clubPut } = require("../controllers")
const { validarCampos } = require("../middlewares/validarCampos")
const {check} = require('express-validator')
const {existeEmailClub, existeClubPorId} = require('../helpers')
const { tieneRole } = require("../middlewares/validarRoles")
const { validarJWT } = require("../middlewares/validarJwt")

const router = Router()

router.get('/', clubGet)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeClubPorId ),
    validarCampos
], clubPut)

router.post('/', [
    validarJWT,
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