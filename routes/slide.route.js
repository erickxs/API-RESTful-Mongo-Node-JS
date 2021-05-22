/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Slide = require('../controllers/slide.controller')

/*=======================================
IMPORTAR EL MIDDLEWARE
=======================================*/

const { tokenVerify } = require('../middlewares/authentication')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-slide', Slide.getSlide)
app.post('/crear-slide', tokenVerify, Slide.createSlide)
app.put('/editar-slide/:id', tokenVerify, Slide.updateSlide)
app.delete('/eliminar-slide/:id', tokenVerify, Slide.deleteSlide)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
