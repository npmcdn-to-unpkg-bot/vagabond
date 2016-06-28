var express = require('express');
var app = express();
var countries = require('./modules/countries.js');
var check = require('./modules/check.js');
var cookieParser = require('cookie-parser')();
var jsonParser = require('body-parser').json();

app.use(jsonParser);
app.use(cookieParser);
app.use('/countries', countries);
app.use('/check', check);
app.use(express.static('./'));


app.listen(8080, function() {
  console.log('everything is working!');
});
