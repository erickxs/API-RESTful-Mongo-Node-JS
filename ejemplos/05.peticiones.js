/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const express = require('express')
const mongoose = require('mongoose')
// const bodyParser = require('body-parser') // bodyParser ha sido deprecado ahora se usa express

/*================================================================
SE CREA PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
================================================================*/

const app = express()

/*============================================
MIDDLEWARE PARA BODY PARSER
============================================*/

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())
app.use(express.json())

/*==========================================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
==========================================================*/

let Schema = mongoose.Schema
let slideSchema = new Schema({
  image: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
})

const Slide = mongoose.model('slides', slideSchema)

/*===============================
PETICIONES GET
===============================*/

app.get('/', (req, res) => {
  // https://mongoosejs.com/docs/api/model.html#model_Model.find

  Slide.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    res.json({
      status: 200,
      data,
    })
  })
})

/*===============================
PETICIONES POST
===============================*/
app.post('/crear-slide', (req, res) => {
  let slide = req.body

  res.json({
    slide,
  })
})
/*===============================
PETICIONES PUT
===============================*/
app.put('/editar-slide/:id', (req, res) => {
  let id = req.params.id

  res.json({
    id,
  })
})
/*===============================
PETICIONES DELETE
===============================*/
app.delete('/borrar-slide/:id', (req, res) => {
  let id = req.params.id

  res.json({
    id,
  })
})
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

app.listen(4000, () => {
  console.log('Esta habilitado el puerto 4000')
})
