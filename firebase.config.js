
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBAS_API_KEYS,
    authDomain: process.env.FIREBAS_DOMAIN,
    projectId: process.env.FIREBAS_PROJECTID,
    storageBucket: process.env.FIREBAS_BUCKET,
    messagingSenderId: process.env.FIREBAS_MSGID,
    appId: process.env.FIREBAS_APPID,
    measurementId: process.env.FIREBAS_MEASID
  };

module.exports = firebaseConfig
  