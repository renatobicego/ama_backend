const usuariosController = require('./usuario')
const clubController = require('./club')
const authController = require('./auth')
const campeonesController = require('./campeones')
module.exports = {
    ...usuariosController,
    ...clubController,
    ...authController,
    ...campeonesController
}