var express = require('express');
var flags = require('../data/flags.js');
var countries = express.Router();

countries.get('/', function(req, res) {
  res.send(flags);
});

module.exports = countries;
