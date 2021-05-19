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
app.post('/crear-galeria', Gallery.createGallery)
app.put('/editar-galeria/:id', Gallery.updateGallery)
app.delete('/eliminar-galeria/:id', Gallery.deleteGallery)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
