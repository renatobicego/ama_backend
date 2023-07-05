const {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} = require("firebase/storage")
const { v4 } = require("uuid")

const storage = getStorage()

const subirArchivoFirebase = async(file, refRoute) => {
    // Obtener extension de archivo (en caso de tener más de un punto, usa fileExtension.length - 1)
    const fileExtension = file.name.split('.')

    // Generar nombre único solo si es una foto
    let newFileName
    if(['jpg', 'jpeg', 'png'].includes(fileExtension[fileExtension.length - 1])){
        newFileName = v4() + '.' + fileExtension[fileExtension.length - 1]
    }else{
        newFileName = file.name
    }

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