var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();

app.use(jsonParser);
app.use(express.static('./'));

app.listen(8080, function() {
  console.log('everything is working!');
});
