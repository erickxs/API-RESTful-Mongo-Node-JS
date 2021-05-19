/*==================================
IMPORTAR EL MODEL
==================================*/
const Gallery = require('../models/gallery.model')

/*===========================================================================================
ESTA PAQUETE SIRVE PARA LA ADMINISTRACIÓN DE CARPETAS Y ARCHIVOS EN NODEJS
===========================================================================================*/
const fs = require('fs')

/*===============================
FUNCIÓN GET
===============================*/

let getGallery = (req, res) => {
  // https://mongoosejs.com/docs/api/model.html#model_Model.find

  Gallery.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en la petición',
      })
    }

    // Contar la cantidad de registros

    Gallery.countDocuments({}, (err, total) => {
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

let createGallery = (req, res) => {
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

  file.mv(`./uploads/gallery/${filename}.${ext}`, (err) => {
    // Si ocurré un error
    if (err) {
      return res.json({
        status: 500,
        message: 'Error al guardar la imagen',
        err,
      })
    }

    // Obtener los datos del formulario para enviarlos al modelo

    let gallery = new Gallery({
      image: `${filename}.${ext}`,
    })
    // Guardar la información en MongoDB
    // https://mongoosejs.com/docs/api.html#model_Model-save

    gallery.save((err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al guardar la imagen de la galería',
          err,
        })
      }
      res.json({
        status: 200,
        message: 'La imagen de la galería ha sido creada con éxito',
        data,
      })
    })
  })
}

/*============================
FUNCIÓN PUT
============================*/

let updateGallery = (req, res) => {
  // Capturar el id del gallery a actualizar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE LA GALERÍA EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Gallery.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que la imagen de la galería exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró la imagen de la galería en la base de datos',
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
          file.mv(`./uploads/gallery/${filename}.${ext}`, (err) => {
            // Si ocurré un error
            if (err) {
              let response = {
                res: res,
                message: 'Error al guardar la imagen',
              }
              reject(response)
            }
            // Eliminar el archivo antiguo;

            if (fs.existsSync(`./uploads/gallery/${currentImage}`)) {
              fs.unlinkSync(`./uploads/gallery/${currentImage}`)
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

    let updateRecord = (id, currentImage) => {
      return new Promise((resolve, reject) => {
        let dataGallery = {
          image: currentImage,
        }

        // Actualizar en MongoDB
        // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
        // https://mongoosejs.com/docs/deprecations.html
        // { new: true, runValidators: true } // Sirve para devolver los datos ya actualizados
        Gallery.findByIdAndUpdate(id, dataGallery, { new: true, runValidators: true }, (err, data) => {
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

        updateRecord(id, currentImage)
          .then((response) => {
            // Esto debe traer res y data
            response['res'].json({
              status: 200,
              message: 'La imágenes de la galería ha sido actualizada con éxito',
              data: response['data'],
            })
          })
          .catch((response) => {
            response['res'].json({
              status: 400,
              message: 'Error al editar la galería',
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

let deleteGallery = (req, res) => {
  // Capturar el id del gallery a eliminar
  let id = req.params.id
  // Obtener el cuerpo del formulario
  let body = req.body

  /*============================================
  VALIDAR QUE EL SLIDE EXISTA
  ============================================*/
  // https://mongoosejs.com/docs/api/model.html#model_Model.findById
  Gallery.findById(id, (err, data) => {
    // Validar que no ocurra un error en el proceso
    if (err) {
      return res.json({
        status: 500,
        message: 'Error en el servidor',
        err,
      })
    }
    // Validar que el gallery exista
    if (!data) {
      return res.json({
        status: 400,
        message: 'No se encontró la imagen de la galería en la base de datos',
      })
    }

    // Borrar la imagen o archivo

    if (fs.existsSync(`./uploads/gallery/${data.image}`)) {
      fs.unlinkSync(`./uploads/gallery/${data.image}`)
    }

    // Borrar registro de mongoDB
    // https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndRemove

    Gallery.findByIdAndRemove(id, (err, data) => {
      if (err) {
        return res.json({
          status: 400,
          message: 'Error al eliminar la imagen de la galería',
          err,
        })
      }

      res.json({
        status: 200,
        message: 'La imagen de la galería se elimino con éxito',
      })
    })
  })
}

/*=======================================================
EXPORTAR LAS FUNCIONES DEL CONTROLADOR
=======================================================*/

module.exports = {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
}
