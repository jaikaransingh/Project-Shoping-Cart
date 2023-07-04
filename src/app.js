const express  = require('express')
const app = express()
const routes = require('./routes/route.js')
const multer = require('multer');



// Global middlewares
app.use(express.json())
app.use(multer().any());
app.use(express.urlencoded({extended : true}))

//route middleware
app.use('/',routes)

module.exports = app