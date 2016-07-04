var express = require('express');
var queue = express.Router();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser')();
var users = require('../data/users.js');

queue.use(jsonParser);
queue.use(cookieParser);

queue.put('/put', function(req, res) {
  var country = req.body.country;
  var user = req.body.user;
  var message = addQueue(user, country);
  console.log('Add');
  console.log(users.users[0].queue);
  res.send(message);
});

queue.delete('/delete', function(req, res)  {
  var country = req.body.country;
  var user = req.body.user;
  var message = removeQueue(user, country);
  console.log('Delete');
  console.log(users.users[0].queue);
  res.send(message);
});

function addQueue(user, country)  {
  var message = '';
  users.users.forEach(function(item)  {
    if(item.username == user) {
      if(item.queue.indexOf(country) == -1) {
        item.queue.push(country);
        message = country + ' added to queue';
      }
      else {
        message = country + ' already in queue';
      }
    }
    else {
      message = user + ' does not exist';
    }
  });
  return message;
}

function removeQueue(user, country) {
  var message = '';
  users.users.forEach(function(item)  {
    if(item.username == user) {
      var index = item.queue.indexOf(country);
      if(index > -1)  {
        item.queue.splice(index, 1);
        message = country + ' removed from queue';
      }
      else {
        message = country + ' is not in the queue';
      }
    }
  });
  return message;
}

module.exports = queue;
