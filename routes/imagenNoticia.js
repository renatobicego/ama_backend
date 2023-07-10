const { Router } = require("express");
const { imagenNoticiaPost } = require("../controllers/noticias");
const { validarJWT } = require("../middlewares/validarJwt");
const { tieneRole } = require("../middlewares/validarRoles");
const { check } = require("express-validator");


const router = Router()

router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'EDITOR_ROLE'),
    check('epigrafe', 'La imagen debe contener un epígrafe').isLength({min: 3}),
    check()
], imagenNoticiaPost)