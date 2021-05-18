/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Gallery = require('../controllers/gallery.controller')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-galeria', Gallery.getGallery)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
