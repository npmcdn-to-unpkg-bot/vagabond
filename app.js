var express = require('express');
var app = express();
var countries = require('./public/modules/countries.js');
var check = require('./public/modules/check.js');
var queue = require('./public/modules/queue.js');
var schedule = require('./public/modules/schedule.js');
var itinerary = require('./public/modules/itinerary.js');
var news = require('./public/modules/news.js');
var email = require('./public/modules/email.js');
var alert = require('./public/modules/alert.js');
var server = require('http').createServer(app);
// var io = require('socket.io')(server);

app.use('/countries', countries);
app.use('/check', check);
app.use('/queue', queue);
app.use('/schedule', schedule);
app.use('/itinerary', itinerary);
app.use('/news', news);
app.use('/email', email);
app.use('/alert', alert);
app.use(express.static('public'));


app.listen(8080, function() {
  console.log('everything is working!');
});
