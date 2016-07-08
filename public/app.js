var express = require('express');
var app = express();
var countries = require('./modules/countries.js');
var check = require('./modules/check.js');
var queue = require('./modules/queue.js');
var schedule = require('./modules/schedule.js');
var itinerary = require('./modules/itinerary.js');
var news = require('./modules/news.js');
var email = require('./modules/email.js');
var alert = require('./modules/alert.js');


app.use('/countries', countries);
app.use('/check', check);
app.use('/queue', queue);
app.use('/schedule', schedule);
app.use('/itinerary', itinerary);
app.use('/news', news);
app.use('/email', email);
app.use('/alert', alert);
app.use(express.static('./'));


app.listen(8080, function() {
  console.log('everything is working!');
});
