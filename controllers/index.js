
const usuariosController = require('./usuario')
const clubController = require('./club')
const authController = require('./auth')
const torneoController = require('./torneo')

module.exports = {
    ...usuariosController,
    ...clubController,
    ...authController,
    ...torneoController
}