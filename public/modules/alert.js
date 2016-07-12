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
  createAlert(country, function(result) {
    console.log(result);
    res.send(result);
  });
});

var total = 0;
var iterator = 0;
function calculate(value)  {
  iterator++;
  total += value;
  if(iterator > 5 && total < 0)  {
    return 'stop';
    iterator = 999;
  } else {
    return 'continue';
  }
}

function createAlert(country, callback) {
  var filteredText = countries.filter(function(item)  {
    if(item.names.name == country)  {
      return item;
    }
  });
  var text = filteredText[0].news;
  var alchemy = new Alchemy(text, 'keywords');

  alchemy.call(function(item) {
    var data = filterRelevence(item);
    var words = [];
    for (let i = 0; i < 10; i++)  {
      var text = data[i].text;
      var alchemy = new Alchemy(data[i].text, 'sentiment');
      alchemy.call(function(called) {
        var score = 0;
        if (called.docSentiment.type == 'neutral') {
          score += 0;
        } else if (data[i].relevance >= .9 && called.docSentiment.type == 'negative') {
          words.push(data[i].text);
          score += Math.pow(called.docSentiment.score, 3);
        } else {
          score += Math.pow(called.docSentiment.score, 3);
        }
        var status = calculate(score);
        if (status == 'stop' && iterator != 999) {
          callback({ message: 'alert', keywords: words });
        } else {
          return;
        }
      });
    }
  });
}

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

var filterRelevence = function(data) {
  var myArray = [];
  var filtered = data.keywords.filter(function(item) {
    if(item.relevance > 0.6)  {
      return item;
    }
  });
  return filtered;
}

// alert.get('/wiki/result', function(req, res)  {
//   var country = 'Bangladesh';
//   var filteredText = countries.filter(function(item)  {
//     if(item.names.name == country)  {
//       return item;
//     }
//   });
//   var text = filteredText[0].wiki;
//   console.log(text);
//
//   var alchemy = new Alchey(text, 'combined');
//   res.send('wiki');
// });

module.exports = alert;
