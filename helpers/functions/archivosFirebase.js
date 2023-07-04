const {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} = require("firebase/storage")
const { v4 } = require("uuid")

const storage = getStorage()

const subirArchivoFirebase = async(file, refRoute) => {
    // Obtener extension de archivo
    const fileExtension = file.name.split('.')[1]
    // Generar nombre único
    const newFileName = v4() + '.' + fileExtension

    // Crear referencia a archivo en Firebase
    const directoryRef = ref(storage, refRoute + newFileName)

    const metadata = {contentType: file.mimetype}

    try {
        await uploadBytesResumable(directoryRef, file.data, metadata) 
    } catch (error) {
        throw new Error('Error al subir el archivo', error)
    }
    

    return refRoute + newFileName

}

const borrarArchivoFirebase = async(refRoute) => {
    const desertRef = ref(storage, refRoute)
    // Borrar archivo
    await deleteObject(desertRef)
    .catch((error) => {
        throw new Error('Error al borrar el archivo', error)
    })
}

module.exports = {
    subirArchivoFirebase,
    borrarArchivoFirebase
}