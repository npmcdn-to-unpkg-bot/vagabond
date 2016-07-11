var express = require('express');
var flags = require('../data/flags.js');
var countriesLong = require('../data/countries.js');
var countries = express.Router();
var message = [];
countriesLong.forEach(function(item)  {
  var data = {};
  data.name = item.names.name;
  data.img = item.names.iso2;
  data.continent = item.names.continent;
  data.language = item.language;
  data.advise = item.advise.US;
  data.electricity = item.electricity;
  data.timezone = item.timezone.name;
  data.water = item.water.short;
  data.vaccinations = item.vaccinations;
  message.push(data);
});

countries.get('/', function(req, res) {
  console.log(message);
  res.send(message);
});

countries.get('/short/:id', function(req, res)  {
  var country = req.params.id;
  var data = message.filter(function(item)  {
    if(item.name.toLowerCase() == country)  {
      return item;
    }
  });
  console.log('DATA');
  console.log(data);
  res.send(data[0]);
});

module.exports = countries;
