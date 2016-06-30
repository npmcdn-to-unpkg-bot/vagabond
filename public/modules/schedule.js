var express = require('express');
var schedule = express.Router();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser')();
var users = require('../data/users.js');

schedule.use(jsonParser);
schedule.use(cookieParser);

schedule.put('/put', function(req, res) {
  var trip = req.body[0];
  var user = req.body[1];
  var message = checkUser(user, trip);
  res.send(message);
});

function checkUser(user, trip) {
  message = '';
  users.users.forEach(function(item)  {
    if(item.username == user) {
      item.schedule.push(trip);
      message = 'Trip added';
    } else {
      message = 'Counld not find ' + user;
    }
  });
  return message;
}

module.exports = schedule;
