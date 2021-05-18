/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const config = require('./config')
const express = require('express')
const mongoose = require('mongoose')

/*================================================================
SE CREA PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
================================================================*/

const app = express()

/*============================================
MIDDLEWARE PARA BODY PARSER
============================================*/

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

/*===================================
IMPORTAR LAS RUTAS
===================================*/

app.use(require('./routes/slide.route'))
app.use(require('./routes/gallery.route'))
app.use(require('./routes/article.route'))

/*============================================
CONEXIÓN A LA BASE DE DATOS
============================================*/

mongoose.connect(
  'mongodb://localhost:27017/apirest',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw err
    console.log('Conectado a la base de datos')
  }
)

/*===================================
SALIDA PUERTO HTTP
===================================*/

app.listen(process.env.PORT, () => {
  console.log(`Esta habilitado el puerto ${process.env.PORT}`)
})
