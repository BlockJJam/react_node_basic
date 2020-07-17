module.exports = function(){
  const express = require('express');
  const session = require('express');
  const bodyParser = require('body-parser');

  let app = express();

  app.use(bodyParser.json()); // application/json 해석
  app.use(bodyParser.urlencoded({ extended:false}));  // application/x-www-form-urlencoded

  return app;
}
