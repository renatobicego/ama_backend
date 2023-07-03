const {getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL} = require("firebase/storage")

const storage = getStorage()

const subirArchivoFirebase = async(file, refRoute) => {
    const directoryRef = ref(storage, refRoute)
    const metadata = {contentType: file.mimetype}
    const uploadTask = await uploadBytesResumable(directoryRef, file.data, metadata)
    // Upload completed successfully, now we can get the download URL
    const downloadURL =  await getDownloadURL(uploadTask.ref)
    return downloadURL

}

module.exports = {
    subirArchivoFirebase
}