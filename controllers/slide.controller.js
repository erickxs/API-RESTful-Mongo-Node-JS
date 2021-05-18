/*==================================
IMPORTAR EL MODEL
==================================*/
const Slide = require('../models/slide.model')

/*===========================================================================================
ESTA PAQUETE SIRVE PARA LA ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
===========================================================================================*/
const fs = require('fs')

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

/*============================
FUNCIÓN PUT
============================*/

let updateSlide = (req, res) => {
  // Capturar el id del slide a actualizar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL SLIDE EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Slide.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el slide exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el slide en la base de datos',
      })
    }

    let currentImage = data.image

    /*==================================================
    VALIDAR QUE HAYA CAMBIO DE IMAGEN
    ==================================================*/

    let validateFileChange = (req, currentImage) => {
      return new Promise((resolve, reject) => {
        if (!req.files) {
          resolve(currentImage)
        } else {
          // Capturar el archivo .file es el nombre que se le da en la variable POST

          let file = req.files.file

          // Extensiones permitidas
          const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'],
            sizeLimit = 2000000 // 2MB

          // Validar la extensión del archivo
          if (!allowedExtensions.includes(file.mimetype)) {
            let response = {
              res: res,
              message: 'Formato de archivo no permitido, solo se aceptan archivos .jpeg, .jpg o .png',
            }

            reject(response)
          } else if (file.size > sizeLimit) {
            let response = {
              res: res,
              message: 'El peso de la imagen debe ser inferior a 2MB',
            }
            reject(response)
          }

          // Cambiar nombre al archivo
          let filename = Math.floor(Math.random() * 10000)
          // Capturar la extensión del archivo
          let ext = file.name.split('.').pop()

          // Mover el archivo a la carpeta
          file.mv(`./uploads/slide/${filename}.${ext}`, (err) => {
            // Si ocurré un error
            if (err) {
              let response = {
                res: res,
                message: 'Error al guardar la imagen',
              }
              reject(response)
            }
            // Eliminar el archivo antiguo;

            if (fs.existsSync(`./uploads/slide/${currentImage}`)) {
              fs.unlinkSync(`./uploads/slide/${currentImage}`)
            }

            // Se le asigna el nuevo nombre
            currentImage = `${filename}.${ext}`
            resolve(currentImage)
          })
        }
      })
    }

    /*=========================================
    ACTUALIZAR LOS REGISTROS
    =========================================*/

    let updateRecord = (id, body, currentImage) => {
      return new Promise((resolve, reject) => {
        let dataSlide = {
          image: currentImage,
          title: body.title,
          description: body.description,
        }

        // Actualizar en MongoDB
        // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
        // https://mongoosejs.com/docs/deprecations.html
        // { new: true, runValidators: true } // Sirve para devolver los datos ya actualizados
        Slide.findByIdAndUpdate(id, dataSlide, { new: true, runValidators: true }, (err, data) => {
          if (err) {
            let response = {
              res: res,
              error: err,
            }

            reject(response)
          }

          let response = {
            res: res,
            data: data,
          }

          resolve(response)
        })
      })
    }

    /*=========================================
    SINCRONIZAR LAS PROMESAS
    =========================================*/

    validateFileChange(req, currentImage)
      .then((currentImage) => {
        // Debe devolver una ruta de imagen actualizada

        updateRecord(id, body, currentImage)
          .then((response) => {
            // Esto debe traer res y data
            response['res'].json({
              status: 200,
              message: 'El slide ha sido actualizado con éxito',
              data: response['data'],
            })
          })
          .catch((response) => {
            response['res'].json({
              status: 400,
              message: 'Error al editar el slide',
              err: response['err'],
            })
          })
      })
      .catch((response) => {
        response['res'].json({
          status: 400,
          message: response['err'],
        })
      })
  })
}

/*===============================
FUNCIÓN DELETE
===============================*/

let deleteSlide = (req, res) => {
  // Capturar el id del slide a eliminar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL SLIDE EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Slide.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el slide exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró el slide en la base de datos',
      })
    }

    // Borrar la imagen o archivo

    if (fs.existsSync(`./uploads/slide/${data.image}`)) {
      fs.unlinkSync(`./uploads/slide/${data.image}`)
    }

    // Borrar registro de mongoDB
    // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove

    Slide.findByIdAndRemove(id, (err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al eliminar el slide',
          err,
        })
      }

      res.json({
        status: 200,
        message: 'El slide se elimino con éxito',
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
  updateSlide,
  deleteSlide,
}
