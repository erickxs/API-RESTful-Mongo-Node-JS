/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/
const mongoose = require('mongoose')

/*==========================================================
ESQUEMA PARA EL MODELO CONECTOR A MONGODB
==========================================================*/

let Schema = mongoose.Schema
let slideSchema = new Schema({
  image: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
})

/*===================================
EXPORTAR EL MODELO
===================================*/
// const Slide = mongoose.model('slides', slideSchema)

module.exports = mongoose.model('slides', slideSchema)
