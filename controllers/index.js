
const usuariosController = require('./usuario')
const clubController = require('./club')
const authController = require('./auth')
const torneoController = require('./torneo')
const campeonesController = require('./campeones')
const inscripcionesController = require('./inscripciones')

module.exports = {
    ...usuariosController,
    ...clubController,
    ...authController,
    ...torneoController,
    ...campeonesController,
    ...inscripcionesController
}