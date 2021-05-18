/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Slide = require('../controllers/slide.controller')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-slide', Slide.getSlide)
app.post('/crear-slide', Slide.createSlide)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
