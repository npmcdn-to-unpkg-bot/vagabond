var express = require('express');
var email = express.Router();
var jsonParser = require('body-parser').json();
// var env = require('../env.js');

email.use(jsonParser);

function createMail(data){
  var helper = require('sendgrid').mail;

  from_email = new helper.Email("test@example.com");
  to_email = new helper.Email("armatis68@gmail.com");
  subject = "View Your Itinerary";
  content = new helper.Content("text/html", data);
  mail = new helper.Mail(from_email, subject, to_email, content);
  // mail.personalizations[0].addTo(email);

  return mail.toJSON();
}

function send(toSend){
  // console.log(JSON.stringify(toSend, null, 2))

  var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);

  var requestBody = toSend;
  var emptyRequest = require('sendgrid-rest').request;
  var requestPost = JSON.parse(JSON.stringify(emptyRequest));
  requestPost.method = 'POST';
  requestPost.path = '/v3/mail/send';
  requestPost.body = requestBody;
  sg.API(requestPost, function (response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  })
}

email.post('/', function(req, res)  {
  var data = req.body;
  console.log('EMAIL');
  console.log(req.body);
  var message = data.itinerary[0].country + ' From: ' + data.itinerary[0].startDate + ' To: ' + data.itinerary[0].endDate;
  send(createMail(message));
  res.send(message);
});

module.exports = email;
