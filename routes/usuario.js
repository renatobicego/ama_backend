const { Router } = require("express");
const {
  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosGetPorClub,
  usuarioGetPorId,
  usuariosPostVarios,
} = require("../controllers");
const { validarCampos } = require("../middlewares/validarCampos");
const { check } = require("express-validator");
const {
  esRoleValido,
  existeUsuarioPorId,
  existeClubPorId,
  existeUsuarioPorDni,
} = require("../helpers");
const { validarJWT } = require("../middlewares/validarJwt");

const router = Router();

router.get("/", usuariosGet);
router.get("/club/:idClub", usuariosGetPorClub);
router.get(
  "/:id",
  [
    check("id", "Usuario no registrado").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuarioGetPorId
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("role").optional().custom(esRoleValido),
    check("dni", "Ingrese el DNI correctamente")
      .optional()
      .isLength({ min: 6 }),
    check("dni").optional().custom(existeUsuarioPorDni),
    check("sexo", "Sexo obligatorio").optional().not().isEmpty(),
    check("pais", "País obligatorio").optional().not().isEmpty(),
    check("fecha_nacimiento", "Fecha de nacimiento incorrecta")
      .optional()
      .isDate({ format: "YYYY-MM-dd" }),
    check("club").optional().custom(existeClubPorId),
    check("federacion", "Federación obligatoria").optional().isMongoId(),
    check("asociacion", "Asociación obligatoria").optional().isMongoId(),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre_apellido", "Nombre obligatorio").not().isEmpty(),
    check("dni", "DNI obligatorio").not().isEmpty(),
    check("dni").custom(existeUsuarioPorDni),
    check("sexo", "Sexo obligatorio").not().isEmpty(),
    check("pais", "País obligatorio").not().isEmpty(),
    check("dni", "Ingrese el DNI correctamente").isLength({ min: 6 }),
    check("fecha_nacimiento", "Fecha de nacimiento obligatoria").isDate({
      format: "YYYY-MM-dd",
    }),
    check("role").custom(esRoleValido),
    check("club").optional().custom(existeClubPorId),
    check("federacion", "Federación no correcta").optional().isMongoId(),
    check("asociacion", "Asociación no correcta").optional().isMongoId(),
    validarCampos,
  ],
  usuariosPost
);
router.post("/varios", usuariosPostVarios);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

module.exports = router;
