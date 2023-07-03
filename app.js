require('dotenv').config()
const { initializeApp } = require('firebase/app')
const firebaseConfig = require("./firebase.config")
const {Server} = require('./models/index')

const firebaseApp = initializeApp(firebaseConfig)
const server = new Server()

server.listen()





