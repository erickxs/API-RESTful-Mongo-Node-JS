/*====================================================================================================
EL PROCESS ES UN OBJETO GLOBAL QUE CORRE EN TODO EL ENTORNO DE DESARROLLO DE NODEJS
====================================================================================================*/

process.env.PORT = process.env.PORT || 4000
process.env.SECRET = 'noquieroquesesepa'
process.env.EXPIRES = 60 * 60 * 60 * 30 // 30 dias
