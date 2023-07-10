const noticiaController = require('./noticia')
const imagenNoticiaController = require('./imagenNoticia')

module.exports = {
    ...noticiaController,
    ...imagenNoticiaController
}