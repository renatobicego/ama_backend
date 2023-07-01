const { Router } = require("express")
const { usuariosPost, usuariosGet, usuariosPut, usuariosDelete } = require("../controllers")
const { validarCampos } = require("../middlewares/validarCampos")
const {check} = require('express-validator')
const {existeEmail, esRoleValido, existeUsuarioPorId} = require('../helpers')
const { tieneRole } = require("../middlewares/validarRoles")
const { validarJWT } = require("../middlewares/validarJwt")

const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ), 
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre_apellido', 'Nombre obligatorio').not().isEmpty(),
    check('dni', 'DNI obligatorio').not().isEmpty(),
    check('fecha_nacimiento', 'Fecha de nacimiento obligatoria').isDate({format: 'YYYY-MM-dd'}),
    check('dni', 'Ingrese el DNI correctamente').isLength({min: 6}),
    check('email', 'Correo no válido').isEmail(),
    check('email').custom(existeEmail),
    check('password', 'Password obligatorio').isLength({min: 8}),
    check('role', 'Rol no válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'ENTRENADOR_ROLE', 'EDITOR_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    // tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete)

module.exports = router