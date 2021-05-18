/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const mongoose = require('mongoose')

/*==========================================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
==========================================================*/

let Schema = mongoose.Schema
let gallerySchema = new Schema({
  photo: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
  },
})

/*===================================
EXPORTAR EL MODELO
===================================*/
// const Gallery = mongoose.model('galleries', gallerySchema)

module.exports = mongoose.model('galleries', gallerySchema)
