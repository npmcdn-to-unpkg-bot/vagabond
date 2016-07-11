var express = require('express');
var cookieParser = require('cookie-parser')();
var jsonParser = require('body-parser').json();
var checkUsers = require('../data/users.js');
var check = express.Router();
check.use(jsonParser);
check.use(cookieParser);

check.get('/:id', function(req, res) {
  // console.log(req.params.id);
  // console.log(req.cookies.name);
  console.log(req.params.id);
  var value = checkCookie(req.cookies.name);
  var message = {};
  message.username = value.username;
  message.queue = value.queue;
    // console.log('hello ' + value.username);
  if(value)  {
    res.send(message);
  } else {
    res.send({message: 'not found'});
  }
});

function checkCookie(check)  {
  var user = checkUsers.users.filter(function(item) {
    if(item.session == check) {
      return item;
    } else {
      return 0;
    }
  });
  return user[0];
}

module.exports = check;
