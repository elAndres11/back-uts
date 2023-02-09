const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
require('dotenv').config()

const app = express()

//capturar el body
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())

//conexion a la base de datos
const url = `mongodb+srv://elandres:tanjiro2106@cluster0.khidili.mongodb.net/test`
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('conectado a la base de Datos!!!'))
.catch((error) => console.log('Error: ' + error))

//creacion e importacion de rutas
const authRoutes = require('./routes/auth')

//ruta del middleware
app.use('/api/user', authRoutes)

//ruta raiz
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: "Si funciona... Vamos a comer!!!"
    })
})

//francamos el servidor
const PORT = process.env.PORT || 9000
app.listen(PORT,  () => {
    console.log(`Escuchad en el puerto: ${PORT}`)
})