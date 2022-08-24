const express = require("express");

const route = express.Router();

route.get('/', (req, res)=>{
  res.send('Prueba de category')
})

module.exports = route;
