const {getStorage, ref, deleteObject } = require("firebase/storage")

const storage = getStorage()


const borrarArchivoFirebase = async(refRoute) => {
    const desertRef = ref(storage, refRoute)

    // Borrar archivo
    await deleteObject(desertRef)
}

module.exports = {
    borrarArchivoFirebase
}