'use strict';
var express = require('express');
var watson = require('watson-developer-cloud');
var env = require('../env.js');
var countries = require('../data/countries');
var alert = express.Router();
var jsonParser = require('body-parser').json();
alert.use(jsonParser);

alert.get('/:id', function(req, res) {
  var country = req.params.id;
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
    var index = 0;
    var words = [];
    for(let i = 0; i < data.length; i++)  {
      var text = data[i].text;
      var alchemy = new Alchemy(data[i].text, 'sentiment');
      alchemy.call(function(called) {
        var dataObject = {}
        // console.log(data[i]);
          if(called.docSentiment.type == 'neutral') {
          dataObject.type = called.docSentiment.type;
          dataObject.score = 0;
          dataObject.message = '';
        } else if(data[i].relevance >= .9) {
          dataObject.type = called.docSentiment.type;
          dataObject.score = Math.pow(called.docSentiment.score, 3);
          dataObject.message = data[i].text;
        } else if(data[i].relevance < .9){
          dataObject.type = called.docSentiment.type;
          dataObject.score = Math.pow(called.docSentiment.score, 3);
          dataObject.message = '';
        }
        if(index > 10 && score < 0)  {
          return;
        } else {
        call(dataObject);
        }
      });
    }
    function call(data) {
      index++;
      var obj = {};
      var message;
      score += data.score;
      if(data.message.length > 0 && data.score < 0) {
        words.push(data.message);
      }
      if(index > 10 && score < 0)  {
        obj.keywords = words;
        obj.message = 'alert';
      } else {
        obj.message = 'clear';
      }

      sendMessage(obj);
    }
  });

  function sendMessage(obj) {
    if(obj.message == 'alert')  {
      res.send(obj);
      console.log(obj);
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

alert.get('/wiki/result', function(req, res)  {
  var country = 'Bangladesh';
  var filteredText = countries.filter(function(item)  {
    if(item.names.name == country)  {
      return item;
    }
  });
  var text = filteredText[0].wiki;
  console.log(text);

  var alchemy = new Alchey(text, 'combined');
  res.send('wiki');
});

module.exports = alert;
