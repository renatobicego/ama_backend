const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validarCampos");
const { existeUsuarioPorDni } = require("../helpers");
const {
  login,
  passwordResetRequest,
  passwordReset,
} = require("../controllers");

const router = Router();

router.post(
  "/login",
  [
    check("dni", "El dni es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post("/password_reset_request", passwordResetRequest);
router.post("/password_reset", passwordReset);

module.exports = router;
