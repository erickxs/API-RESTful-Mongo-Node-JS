/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Gallery = require('../controllers/gallery.controller')

/*=======================================
IMPORTAR EL MIDDLEWARE
=======================================*/
const { tokenVerify } = require('../middlewares/authentication')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-galeria', Gallery.getGallery)
app.post('/crear-galeria', tokenVerify, Gallery.createGallery)
app.put('/editar-galeria/:id', tokenVerify, Gallery.updateGallery)
app.delete('/eliminar-galeria/:id', tokenVerify, Gallery.deleteGallery)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
