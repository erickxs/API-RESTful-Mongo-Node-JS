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

/*=============================
FUNCIÓN POST
=============================*/

let createSlide = (req, res) => {
  // Obtener el cuerpo del formulario

  let body = req.body

  if (!req.files) {
    return res.json({
      status: 400,
      message: 'La imagen no puede ir vacía',
    })
  }

  // Capturar el archivo .file es el nombre que se le da en la variable POST

  let file = req.files.file

  // Extensiones permitidas
  const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'],
    sizeLimit = 2000000 // 2MB

  // Validar la extensión del archivo
  if (!allowedExtensions.includes(file.mimetype)) {
    // if (file.mimetype != 'image/jpeg' || file.mimetype != 'image/png') {
    return res.json({
      status: 400,
      message: 'Formato de archivo no permitido, solo se aceptan archivos .jpeg, .jpg o .png',
    })
  } else if (file.size > sizeLimit) {
    return res.json({
      status: 400,
      message: 'El peso de la imagen debe ser inferior a 2MB',
    })
  }

  // Cambiar nombre al archivo
  let filename = Math.floor(Math.random() * 10000)
  // Capturar la extensión del archivo
  let ext = file.name.split('.').pop()

  // Mover el archivo a la carpeta

  file.mv(`./uploads/slide/${filename}.${ext}`, (err) => {
    // Si ocurré un error
    if (err) {
      return res.json({
        status: 500,
        message: 'Error al guardar la imagen',
        err,
      })
    }

    // Obtener los datos del formulario para enviarlos al modelo

    let slide = new Slide({
      image: `${filename}.${ext}`,
      title: body.title,
      description: body.description,
    })
    // Guardar la información en MongoDB
    // https://mongoosejs.com/docs/api.html#model_Model-save

    slide.save((err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al guardar el slide',
          err,
        })
      }
      res.json({
        status: 200,
        message: 'El slide ha sido creado con éxito',
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
  createSlide,
}
