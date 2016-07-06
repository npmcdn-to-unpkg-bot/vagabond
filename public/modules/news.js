var express = require('express');
var news = express.Router();
var jsonParser = require('body-parser').json();
var watson = require('watson-developer-cloud');
var env = require('../env.js');

news.use(jsonParser);

function initWatson(country, callback) {
  console.log(country);
  var alchemy_data_news = watson.alchemy_data_news({
    api_key: process.env.API_KEY
  });

  var params = {
    start: 'now-1d',
    end: 'now',
    count: 1,
    'q.enriched.url.text': country,
    'q.enriched.url.taxonomy.taxonomy_.label': 'travel',
    return: 'enriched.url.title,enriched.url.url'
  };

  alchemy_data_news.getNews(params, function (err, news)  {
    if(err) {
      console.log(news);
      console.log('error: ', err);
    }  else {
      callback(news.result.docs);
    }
  });
}

news.get('/:name', function(req, res) {
  var country = req.params.name;
  initWatson(country, function(data) {
    res.send(data);
  });
});

module.exports = news;
