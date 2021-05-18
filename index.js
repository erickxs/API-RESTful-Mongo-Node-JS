/*==========================================
UBICAR LOS REQUERIMIENTOS
==========================================*/

const config = require('./config'),
  express = require('express'),
  mongoose = require('mongoose'),
  fileUpload = require('express-fileupload')

/*================================================================
SE CREA PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
================================================================*/

const app = express()

/*============================================
MIDDLEWARE PARA EXPRESS(ANTES BODY PARSER)
============================================*/
// Los middleware son para poder usarlos en todos lados de la aplicación
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// parse application/json
app.use(express.json({ limit: '10mb', extended: true }))

/*===========================================
MIDDLEWARE PARA FILEUPLOAD
===========================================*/
app.use(fileUpload())

/*======================================
MONGOOSE DEPRECATIONS
======================================*/

// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useUnifiedTopology', true)

/*===================================
IMPORTAR LAS RUTAS
===================================*/

app.use(require('./routes/slide.route'))
app.use(require('./routes/gallery.route'))
app.use(require('./routes/article.route'))

/*============================================
CONEXIÓN A LA BASE DE DATOS
============================================*/

mongoose.connect(
  'mongodb://localhost:27017/apirest',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw err
    console.log('Conectado a la base de datos')
  }
)

/*===================================
SALIDA PUERTO HTTP
===================================*/

app.listen(process.env.PORT, () => {
  console.log(`Esta habilitado el puerto ${process.env.PORT}`)
})
