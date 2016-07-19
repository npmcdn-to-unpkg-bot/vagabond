var express = require('express');
var news = express.Router();
var jsonParser = require('body-parser').json();
var watson = require('watson-developer-cloud');
// var env = require('../env.js');

news.use(jsonParser);

function initWatson(country, sentiment, callback) {
  console.log(country);
  var alchemy_data_news = watson.alchemy_data_news({
    api_key: process.env.API_KEY
  });

  if(sentiment == 'any') {
    var params = {
      start: 'now-10d',
      end: 'now',
      count: 3,
      'q.enriched.url.text': country,
      'q.enriched.url.taxonomy.taxonomy_.label': 'travel',
      return: 'enriched.url.title,enriched.url.url'
    };
  } else {
    var params = {
      start: 'now-1d',
      end: 'now',
      count: 3,
      'q.enriched.url.docSentiment.type': sentiment,
      'q.enriched.url.text': country,
      'q.enriched.url.taxonomy.taxonomy_.label': 'travel',
      return: 'enriched.url.title,enriched.url.url'
    };
  }

  alchemy_data_news.getNews(params, function (err, news)  {
    if(err) {
      console.log(news);
      console.log('error: ', err);
    }  else {
      callback(news.result.docs);
    }
  });
}

news.put('/', function(req, res) {
  var country = req.body.country;
  var sentiment = req.body.sentiment;
  console.log(req.body);
  initWatson(country, sentiment, function(data) {
      console.log(data);
      res.send(data);
    });

});

module.exports = news;
