var express = require('express');
var app = express();
var countries = require('./modules/countries.js');
var check = require('./modules/check.js');
var queue = require('./modules/queue.js');
var schedule = require('./modules/schedule.js');
var itinerary = require('./modules/itinerary.js');
var news = require('./modules/news.js');
var cookieParser = require('cookie-parser')();
var jsonParser = require('body-parser').json();
// var watson = require('watson-developer-cloud');
// var env = require('./env.js');
// process.env.api_key

app.use(jsonParser);
app.use(cookieParser);
app.use('/countries', countries);
app.use('/check', check);
app.use('/queue', queue);
app.use('/schedule', schedule);
app.use('/itinerary', itinerary);
app.use('/news', news);
app.use(express.static('./'));

// function initWatson() {
//   var alchemy_data_news = watson.alchemy_data_news({
//     api_key: process.env.API_KEY
//   });
//
//   var params = {
//     start: 'now-1d',
//     end: 'now',
//     count: 1,
//     'q.enriched.url.text': 'Bangladesh',
//     'q.enriched.url.taxonomy.taxonomy_.label': 'travel',
//     return: 'enriched.url.title,enriched.url.url'
//   };
//   alchemy_data_news.getNews(params, function (err, news)  {
//     if(err) {
//       console.log(news);
//       console.log('error: ', err);
//     }  else {
//       console.log(JSON.stringify(news, null, 2));
//     }
//   });
// }
//
// app.get('/watson', function(req, res) {
//   initWatson();
// });

app.listen(8080, function() {
  console.log('everything is working!');
});
