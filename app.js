require('dotenv').config()
const { initializeApp } = require('firebase/app')
const {getAnalytics} = require('firebase/analytics')
const firebaseConfig = require("./firebase.config")
const {Server} = require('./models/index')

const firebaseApp = initializeApp(firebaseConfig)
const server = new Server()

server.listen()





