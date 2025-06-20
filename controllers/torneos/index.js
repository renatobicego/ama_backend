const torneoController = require('./torneo')
const inscripcionesController = require('./inscripciones')
const pruebaAtletaController = require('./pruebaAtleta')
module.exports = {
    ...torneoController,
    ...inscripcionesController,
    ...pruebaAtletaController
}