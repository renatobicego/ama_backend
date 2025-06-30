const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validarCampos");
const { login } = require("../controllers");

const router = Router();

router.post(
  "/login",
  [check("dni", "El dni es obligatorio").not().isEmpty(), validarCampos],
  login
);

module.exports = router;
