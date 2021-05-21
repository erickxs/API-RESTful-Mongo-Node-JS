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
app.get('/mostrar-articulos', Article.getArticles)
app.post('/crear-articulo', Article.createArticle)
app.put('/editar-articulo/:id', Article.updateArticle)
app.delete('/eliminar-articulo/:id', Article.deleteArticle)

/*=================================
EXPORTAR LA RUTA
=================================*/

module.exports = app
