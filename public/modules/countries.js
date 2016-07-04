var express = require('express');
var flags = require('../data/flags.js');
var countriesLong = require('../data/countries.js');
var countries = express.Router();
var message = [];
countriesLong.forEach(function(item)  {
  var package = {};
  package.name = item.names.name;
  package.img = item.names.iso2;
  package.continent = item.names.continent;
  package.language = item.language;
  package.advise = item.advise.US;
  message.push(package);
});

countries.get('/', function(req, res) {
  console.log(message);
  res.send(message);
});

module.exports = countries;
