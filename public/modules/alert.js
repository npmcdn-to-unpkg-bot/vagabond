var express = require('express');
var watson = require('watson-developer-cloud');
var env = require('../env.js');
var countries = require('../data/countries');
var alert = express.Router();
var jsonParser = require('body-parser').json();
alert.use(jsonParser);

alert.get('/:id', function(req, res) {
  var country = req.params.id;
  var scores = [];
  var score = 0;
  var filteredText = countries.filter(function(item)  {
    if(item.names.name == country)  {
      return item;
    }
  });
  var text = filteredText[0].news;
  console.log(text);
  var alchemy = new Alchemy(text, 'keywords');

  alchemy.call(function(item) {
    var data = feed(item);
    for(var i = 0; i < data.length - 1; i++)  {
      var text = data[i].text;
      var alchemy = new Alchemy(data[i].text, 'sentiment');
      alchemy.call(function(called) {
        var dataObject = {}
          if(called.docSentiment.type == 'neutral') {
          dataObject.type = called.docSentiment.type;
          dataObject.score = 0;
        } else {
          dataObject.type = called.docSentiment.type;
          dataObject.score = Math.pow(called.docSentiment.score, 3);
        }
        if(scores.length > 10 && score < 0)  {
          return;
        } else {
        call(dataObject);
        }
      });
    }

    function call(data) {
      scores.push(data);
      score += data.score;
      console.log('score ' + score);
      if(scores.length > 10 && score < 0)  {
        message = 'alert';
      } else {
        message = 'clear';
      }
      sendMessage(message);
    }
  });

  function sendMessage(message) {
    if(message == 'alert')  {
      res.send({message: 'alert'});
    } else {
      console.log('clear');
      return;
    }
  }
});

var Alchemy = function(text, type)  {
  this.text = text;
  var alchemy_language = watson.alchemy_language({
    api_key: process.env.API_KEY
  });
  var params = { text: this.text };
  this.call = function(callback)  {
    alchemy_language[type](params, function(err, response)  {
      if(err) {
        console.log('error: ', err);
      } else {
        callback(response);
      }
    });
  }
}

var feed = function(data) {
  var myArray = [];
  var filtered = data.keywords.filter(function(item) {
    if(item.relevance > 0.6)  {
      return item;
    }
  });
  return filtered;
}
module.exports = alert;
