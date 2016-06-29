var express = require('express');
var queue = express.Router();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser')();
var users = require('../data/users.js');

queue.use(jsonParser);
queue.use(cookieParser);

queue.put('/', function(req, res) {
  console.log(req.body.country);
});



module.exports = queue;
