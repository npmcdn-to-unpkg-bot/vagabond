var express = require('express');
var watson = require('watson-developer-cloud');
var env = require('../env.js');
var alert = express.Router();
var jsonParser = require('body-parser').json();

alert.use(jsonParser);

alert.get('/', function(req, res) {
  var scores = [];
  var score = 0;
  var text = 'DHAKA:  Bangladesh police shot dead the pizza chef of a Dhaka restaurant, mistakenly thinking he was one of the militants who killed 20 people, and misread online warnings of an impending assault, police and government officials said on Tuesday. New details from interviews with the officials and the first information report registered at a Daka police station painted a picture of security agencies slow to deal with Friday\'s attack, one of the country\'s deadliest. \"This was the first time in Bangladesh such a thing had taken place. Nobody was prepared for it. They did not realise the gravity of the situation initially,\" HT Imam, a political adviser to Prime Minister Sheikh Hasina, told Reuters in an interview. \"Initial response was slow.\" Bangladesh authorities who monitor social media saw several messages on Friday posted on Twitter saying there would be an attack, he said. But the police thought any attack was more likely to target embassies and major hotels and restaurants, Imam said. Police closed major hotels and eateries in and around hotel Westin, about 1 km (0.62 mile) from the Holey Artisan Bakery and O\'Kitchen, the restaurant that was attacked, he said. \"They (police) didn\'t think at all it can be this place,\" Imam said. \"It is to be investigated whether there was an intelligence failure.\" The attack, claimed by Islamic State, marked a major escalation in the scale and brutality of violence aimed at forcing strict Islamic rule onto Bangladesh, whose 160 million people are mostly Muslim. Police named five Bangladeshi gunmen who stormed the restaurant: Nibras Islam, Rohan Imtiaz, Meer Saameh Mubasheer, Khairul Islam and Shafiqul Islam. Several other people have been arrested. The attackers separated foreigners from locals, and most of the dead were foreigners, from Italy, Japan, India and the United States. But survivors told local television that Muslims who could not recite the Koran were also killed. The targeting of foreigners has unsettled the country\'s $26 billion garment export industry, with some foreign retailers suspending all business travel to the country. The bodies of the nine Italian victims were flown to Rome on Tuesday. Investigators there are looking into whether Italians were specifically targeted, a judicial source said. Foreign Minister Paolo Gentiloni, who went to Rome\'s Ciampino airport for the plane\'s arrival, said he was committed to making sure the victims received state assistance in line with Italian law, which also provides for their families. Islamic State and al Qaeda have claimed a series of killings of liberals and members of religious minorities in Bangladesh in he past year. The government has dismissed those claims, as it did Islamic State\'s claim of responsibility for Friday\'s attack. Police believe Jamaat-ul-Mujahideen Bangladesh an outlawed domestic group that has pledged allegiance to Islamic State, played a significant role in organising the privileged, educated, young attackers. Confusion over exactly how many gunmen were involved was at least partly cleared up on Tuesday, when police named Saiful Islam Chowkidar, a pizza maker at the Holey Artisan Bakery, as among the six people security forces killed when they stormed the building to end a 12-hour stand-off. \"He may not be involved,\" Saiful Islam, a police official investigating the attack, told Reuters, adding Chowkidar\'s death was still being investigated. An employee at the cafe, shown a photo of a man killed at the eatery and wearing a chef\'s outfit, identified him as Chowkidar, and said he had worked there for 18 months. BRUTAL ATTACK In the police filing, seen by Reuters, Chowkidar\'s name was included among 21 hostages killed by attackers armed with knives, guns and explosives. At least three Bangladeshis were also murdered during the assault. One was a Muslim woman, a regular at the restaurant who did not wear the Islamic veil, whose throat was slashed when she refused to recite the Koran, Imam said. Two police officers were killed outside the restaurant. The police report showed that police made an initial attempt to enter the restaurant after the attackers stormed in, but facing gunfire and grenades they held off any action for more than eight hours. \"The terrorists kept firing and throwing grenades at us every time we moved forward,\" the report said. Between 30 and 35 policemen were wounded when the attackers threw grenades at a force stationed to the west of the cafe, forcing police to wait for reinforcements. Eventually, the police raid was launched after daybreak. Imam said police repeatedly sent messages asking what the attackers wanted, initially thinking they sought a ransom. The fear was the hostages would be killed if the police forced their way in, he said. \"The way the police and the RAB acted in the early hours raises questions that need to be looked into,\" Imam said, referring to the Rapid Action Battalion, an elite counter-terrorism unit. At least three of the gunmen were from wealthy, liberal families who had attended elite Dhaka schools, in contrast to the usual Bangladeshi militant\'s path from poverty and a madrassa education to violence.';
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
