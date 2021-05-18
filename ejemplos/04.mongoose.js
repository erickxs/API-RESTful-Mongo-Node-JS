/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const express = require('express')
const mongoose = require('mongoose')

/*================================================================
SE CREA PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
================================================================*/

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

const app = express()

/*===============================
PETICIONES GET
===============================*/

app.get('/', (req, res) => {
  // res.send('Hola Mundo desde Express')

  let salida = {
    nombre: 'Erick de Leon',
    edad: 33,
    url: req.url,
  }

  res.send(salida)
})

/*============================================
CONEXIÓN A LA BASE DE DATOS
============================================*/

/*===================================
SALIDA PUERTO HTTP
===================================*/

app.listen(4000, () => {
  console.log('Esta habilitado el puerto 4000')
})
