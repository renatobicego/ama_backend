const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const dbConnection = async () => {

    try {
        // mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGODB_ATLAS)

        console.log('Base de datos online');
    } catch (error) {
        throw new Error('Error conexión base de datos')
    }

}

module.exports = {
    dbConnection
}