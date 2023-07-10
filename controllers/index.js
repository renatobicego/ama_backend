
const usuariosController = require('./usuarios')
const torneosController = require('./torneos')
const noticiasController = require('./noticias')

module.exports = {
    ...usuariosController,
    ...torneosController,
    ...noticiasController
}