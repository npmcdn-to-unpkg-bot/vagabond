var express = require('express');
var app = express();
var countries = require('./modules/countries.js');
var check = require('./modules/check.js');
var queue = require('./modules/queue.js');
var schedule = require('./modules/schedule.js');
var itinerary = require('./modules/itinerary.js');
var cookieParser = require('cookie-parser')();
var jsonParser = require('body-parser').json();

app.use(jsonParser);
app.use(cookieParser);
app.use('/countries', countries);
app.use('/check', check);
app.use('/queue', queue);
app.use('/schedule', schedule);
app.use('/itinerary', itinerary);
app.use(express.static('./'));


app.listen(8080, function() {
  console.log('everything is working!');
});
