/*==================================
IMPORTAR EL MODEL
==================================*/
const Slide = require('../models/slide.model')

/*===============================
FUNCIÓN GET
===============================*/

let getSlide = (req, res) => {
  // https://mongoosejs.com/docs/api/model.html#model_Model.find

  Slide.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    // Contar la cantidad de registros

    Slide.countDocuments({}, (err, total) => {
      if (err) {
        return res.json({
          status: 500,
          message: 'Error en la petición',
        })
      }
      res.json({
        status: 200,
        total,
        data,
      })
    })
  })
}

/*=======================================================
EXPORTAR LAS FUNCIONES DEL CONTROLADOR
=======================================================*/

module.exports = {
  getSlide,
}
