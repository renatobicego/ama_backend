
const usuariosController = require('./usuario')
const clubController = require('./club')
const authController = require('./auth')

module.exports = {
    ...usuariosController,
    ...clubController,
    ...authController
}