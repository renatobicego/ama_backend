const { Schema, model } = require('mongoose');

const PruebaAtletaSchema = Schema({
    marca: {
        type: String
    },
    atleta: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    prueba: {
        type: Schema.Types.ObjectId,
        ref: 'Prueba',
        required: true
    },
})

PruebaAtletaSchema.pre('save', async function (next) {
    try {
      // Obtener el tipo de prueba desde el modelo "Prueba" referenciado.
      if (this.marca || this.marca !== undefined) {
        return next();
      }
      const tipoPrueba = await this.model('Prueba').findById(this.prueba).select('tipo')
      // Establecer el valor predeterminado de "marca" según el tipo de prueba.
      if (tipoPrueba.tipo === 'L') {
        this.marca = '00.00';
      } else if (tipoPrueba.tipo === 'F') {
        this.marca = '99.99.99';
      } else if (tipoPrueba.tipo === 'P') {
        this.marca = '99.99' 
      } else if (tipoPrueba.tipo === 'S') {
        this.marca = '0.00' 
      }else if (tipoPrueba.tipo === 'C') {
        this.marca = '0000' 
      }

  
      next(); // Continuar con el guardado del documento.
    } catch (error) {
      next(error); // Manejar cualquier error que ocurra durante el proceso.
    }
})


module.exports = model( 'PruebaAtleta', PruebaAtletaSchema )