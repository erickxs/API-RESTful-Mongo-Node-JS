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

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
