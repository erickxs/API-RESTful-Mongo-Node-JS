/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const express = require('express')

/*================================================================
SE CREA PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
================================================================*/

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

/*=================Salinda puerto HTTP
Salinda puerto HTTP
=================Salinda puerto HTTP*/

app.listen(4000, () => {
  console.log('Esta habilitado el puerto 4000')
})
