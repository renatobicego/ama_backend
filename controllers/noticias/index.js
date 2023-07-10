const noticiaController = require('./noticia')
const imagenNoticiaController = require('./imagenNoticia')
const parrafoController = require('./parrafo')

module.exports = {
    ...noticiaController,
    ...imagenNoticiaController, 
    ...parrafoController
}