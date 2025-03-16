const { Router } = require("express");
const {
  clubPost,
  clubGet,
  clubDelete,
  clubPut,
  clubGetPorNombre,
  clubGetPorId,
} = require("../controllers");
const { validarCampos } = require("../middlewares/validarCampos");
const { check } = require("express-validator");
const { existeClubPorId } = require("../helpers");
const { tieneRole } = require("../middlewares/validarRoles");
const { validarJWT } = require("../middlewares/validarJwt");

const router = Router();

router.get("/", clubGet);
router.get("/:nombre", clubGetPorNombre);
router.get("/id/:id", clubGetPorId);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "EDITOR_ROLE", "ENTRENADOR_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeClubPorId),
    check("entrenadores", "Ingrese al menos un entrenador a cargo")
      .optional()
      .isArray({ min: 1 }),
    validarCampos,
  ],
  clubPut
);

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "EDITOR_ROLE", "ENTRENADOR_ROLE"),
    check("nombre", "Nombre de club obligatorio").not().isEmpty(),
    check("ciudad", "Ciudad/Departamento obligatorio").not().isEmpty(),
    check("siglas", "Siglas obligatorias").not().isEmpty(),
    validarCampos,
  ],
  clubPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "EDITOR_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeClubPorId),
    validarCampos,
  ],
  clubDelete
);

module.exports = router;
