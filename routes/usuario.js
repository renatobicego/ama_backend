const { Router } = require("express")
const { usuariosPost } = require("../controllers")
const { validarCampos } = require("../middlewares/validarCampos")
const {check} = require('express-validator')
const {existeEmail} = require('../helpers')

const router = Router()


router.post('/', [
    check('nombre_apellido', 'Nombre obligatorio').not().isEmpty(),
    check('email', 'Correo no válido').isEmail(),
    check('email').custom(existeEmail),
    check('password', 'Password obligatorio').isLength({min: 8}),
    check('rol', 'Rol no válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'ENTRENADOR_ROLE', 'EDITOR_ROLE']),
    // check('rol').custom(esRolValido),
    validarCampos
], usuariosPost)

module.exports = router