var express = require('express');
var itinerary = express.Router();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser')();
var users = require('../data/users.js');

itinerary.use(jsonParser);
itinerary.use(cookieParser);

itinerary.post('/post', function(req, res)  {
  var user = req.body[0];
  var trip = req.body[1];
  var message = setItinerary(user, trip);
  res.send(message);
  console.log('Itinerary');
  console.log(users.users[0].itinerary);
});


function setItinerary(user, trip) {
  message = '';
  users.users.forEach(function(item)  {
    if(item.username == user) {
      item.itinerary.push(trip);
      message = { message:'Itinerary added', trip: trip };
    } else {
      message = { message: 'Could not find ' + user, trip: 0 };
    }
  });
  return message;
}
module.exports = itinerary
