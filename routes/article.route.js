/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const express = require('express')
const app = express()

/*========================================
IMPORTAR EL CONTROLADOR
========================================*/
const Article = require('../controllers/article.controller')

/*================================
CREAR LAS RUTAS HTTP
================================*/
app.get('/mostrar-articulos', Article.getArticle)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
