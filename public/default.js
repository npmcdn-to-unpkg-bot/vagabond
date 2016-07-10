// Global Variables *******************************//
//*************************************************//
document.cookie = "name=derp";
var body = document.body;
var countries = document.getElementById('countries');
var itinerary = document.getElementById('itinerary');
var details = document.getElementById('details');
var places = [];
var schedule = [];
var currentUser = [];
var grid = htmlBlock('div', [['class', 'grid']], '', countries);
var iso = new Isotope('.grid', {
  itemSelector: '.grid-item-content'
});
var filterFunctions = {};

// Events ***************************************//
//**********************************************//

window.addEventListener('load', function(e) {
  initCountries();
  if(document.cookie) {
    var call = new Call('GET');
    call.path = '/check/' + document.cookie;
    call.request(function(result)  {
      var user = new User(result);
      user.populate();
      user.init(sideBar);
    });
  } else {
    var user = new User('empty');
    user.populate();
    user.init(sideBar);
  }
});

body.addEventListener('mouseover', function(e)  {
  overlay(e);
});

body.addEventListener('click', function(e)  {
  addButton(e);
  initItinerary(e);
  initPlaces(e, places);
  returnCountries(e);
  createLayout(e);
  initDetails(e);
});

// Constructor Functions *****************************//
//***************************************************//

var Trip = function(destination, begin, end)  {
  var self = this;
  this.destination = destination;

  this.start = begin.split('-');
  this.startDate = function() {
     var date = new Date();
     date.setFullYear(this.start[0]);
     date.setMonth(this.start[1]-1);
     date.setDate(this.start[2]);
     return date.toLocaleString('en-Us');
  }
  this.finish = end.split('-');
  this.endDate = function() {
     var date = new Date();
     date.setFullYear(this.finish[0]);
     date.setMonth(this.finish[1]-1);
     date.setDate(this.finish[2]);
     return date.toLocaleString('en-Us');
  }
  this.trip = {};

  this.addTrip = function() {
    this.trip.id = Date.now();
    this.trip.country = this.destination;
    this.trip.startDate = this.startDate();
    this.trip.endDate = this.endDate();

    schedule.push(this.trip);
    var data = [this.trip, currentUser[0]];
    var call = new Call('PUT');
    call.path = '/schedule/put';
    call.request(data);
  }
}

var Itinerary = function(schedule)  {
  this.schedule = schedule;
  var dataObject = {};
  dataObject.id = Date.now();
  dataObject.itinerary = this.schedule;
  this.setItinerary = function()  {
    var data = [currentUser[0], dataObject];
    var call = new Call('POST');
    call.path = '/itinerary/post';
    call.request(data, function(result) {
      var data = JSON.parse(result);
      console.log(data.trip);
      if(data.message == 'Itinerary added') {
        var call = new Call('POST');
        call.path = '/email';
        call.request(data.trip);
      }
    });
  }
}

var Country = function(item)  {
  this.name = item.name;
  this.queue = false;
  this.continent = item.continent;
  this.flag = item.img;
  this.timezone = item.timezone;
  this.voltage = item.electricity.voltage;
  this.frequency = item.electricity.frequency;
  this.plugs = item.electricity.plugs;
  this.getPlugImage = function()  {
    return this.plugs.map(function(items)  {
      var plug = items.toLowerCase();
      return 'plugs/' + plug + '.png';
    });
  }
  this.plugImage = this.getPlugImage();
  this.getWater = function()  {
    if(item.water == null)  {
      return 'No data';
    } else {
      return item.water;
    }
  }
  this.water = this.getWater();
  this.getAdvise = function()  {
    if(item.advise) {
      return item.advise.advise;
    } else {
      return 'safe';
    }
  }
  this.advise = this.getAdvise();
  this.getLanguage = function()  {
    if(item.language[0])  {
      return item.language[0].language;
    } else {
      return 'none';
    }
  }
  this.language = this.getLanguage();
  this.getVaccinations = function() {
    if(item.vaccinations.length < 1)  {
      return 'None';
    } else {
      return item.vaccinations;
    }
  }
  this.vaccinations = this.getVaccinations();
  this.normalize = function(property) {
    return property.toLowerCase();
  }

}

var User = function(result) {
  this.username = result.username;
  this.queue = result.queue;
  this.schedule = result.schedule;
  this.itinerary = result.itinerary;
  this.log = function() {
    console.log(this.username);
    console.log(this.queue);
    console.log(this.schedule);
    console.log(this.itinerary);
  }
  this.init = function(callback)  {
    callback(this);
  }
  this.populate = function()  {
    if(this.username) {
      currentUser.push(this.username);
    }
    if(this.queue)  {
      this.queue.forEach(function(item) {
        places.push(item);
      });
    }
  }
}

var Queue = function(country)  {
  this.country = country;
  var data = {};

  this.add = function() {
    places.push(this.country);
    data.country = this.country;
    data.user = currentUser[0];
    var call = new Call('PUT');
    call.path = '/queue/put';
    call.request(data);
  }

  this.remove = function() {
    var index = places.indexOf(this.country);
    if(index > -1)  {
      places.splice(index, 1);
    }
    data.country = this.country;
    data.user = currentUser[0];
    var call = new Call('DELETE');
    call.path = '/queue/delete';
    call.request(data);
  }
}

var Call = function(verb) {
  this.verb = verb;
  this.request = function(argument, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(this.verb, this.path);
    xhr.setRequestHeader('Content-type', 'application/json');
    if(this.verb == 'GET') {
      xhr.send();
      xhr.addEventListener('load', function() {
        argument(JSON.parse(xhr.responseText));
      });
    } else {
      if(callback)  {
        xhr.send(JSON.stringify(argument));
        xhr.addEventListener('load', function(e)  {
          callback(xhr.responseText);
        });
        return;
      }
      xhr.send(JSON.stringify(argument));
      xhr.addEventListener('load', function(e)  {
        console.log(xhr.responseText);
      });
    }
  }
}

var News = function(arg) {
  this.data = function()  {
    var info = arg.map(function(item)  {
      return item.source.enriched.url;
    });
    return info;
  }
  this.story = this.data();
}

// Initialization Funcitons *******************************//
//********************************************************//
function initLogin(e) {
  if(document.cookie) {
    return;
  } else if(e.target.className == 'login-panel')  {
    document.cookie = "name=derp";
  }
}


function sideBar(user)  {
  if(user.username) {
    var message = 'Welcome, ' + user.username;
  } else {
    message = 'Login';
  }
  displayName(message);
}

function initItinerary(e)  {
  if(e.target.id == 'submit-itinerary') {
    var itinerary = new Itinerary(schedule);
    itinerary.setItinerary();
  }
  else {
    return;
  }
}

function returnCountries(e) {
  if(e.target.id == 'return-countries') {
    clearChildren(itinerary);
  } else {
    return;
  }
}

function initCountries()  {
  var call = new Call('GET');
  call.path = '/countries';
  call.request(function(result)  {
    getCountry(result, iso);
  });
}

function initPlaces(e, array) {
  if(e.target.className == 'view-itinerary')  {
    clearChildren(itinerary);
    clearChildren(details);
    var call = new Call('GET');
    call.path = '/countries';
    call.request(function(result)  {
      initWell();
      array.forEach(function(item)  {
        itineraryRow(item, result);
      });
    });
  }
}

function displayName(name) {
  if(name.length < 1 || name == 'Login')  {
    var className = 'login';
  } else {
    className = 'user';
  }
  displayFilters(name, className);
}

function createLayout(e)  {
  if(e.target.classList.contains('filter-button')) {
    if(e.className == 'button-group filters-button-group')  {
      if (!matchesSelector(e.target, 'div')) {
        return;
      }
    }
    var buttonGroup = e.target.parentElement;
    var filterGroup = buttonGroup.getAttribute('data-filter-group');
    console.log(e.target.getAttribute('data-filter'));
    console.log(filterGroup);
    filterFunctions[filterGroup] = e.target.getAttribute('data-filter');
    console.log(filterFunctions);
    var filterValue = concatValues(filterFunctions);
  } else if (e.target.className == 'view-itinerary' || e.target.classList.contains('country-details')) {
      filterValue = 'kill';
  } else if(e.target.id == 'return-countries' || e.target.className == 'close')  {
      filterValue = concatValues(filterFunctions);
  } else {
      return;
  }
  iso.arrange({ filter: filterValue });
  function concatValues(obj) {
    var value = '';
    for (var prop in obj) {
      value += obj[prop];
    }
    return value;
  }
}


// DOM Manipulation *******************************************//
//*************************************************************//
function addButton(e) {
  var country = e.target.dataset.country;
  var queue = new Queue(country);
  var target = e.target;
  if(places.indexOf(country) == -1 && e.target.className == 'btn btn-warning add-button')  {
    queue.add();
    target.textContent = 'Remove from Itinerary';
    target.className = 'btn btn-danger button-remove';
    var call = new Call('GET');
    call.path = '/alert/' + upperCase(country);
    call.request(function(result) {
      console.log(result);
      if(result.message == 'alert') {
        var alert = htmlBlock('div', [['class', 'btn btn-danger alert']], country.toUpperCase() + '!!!', body);
        result.keywords.forEach(function(word)  {
          htmlBlock('div', [], word, alert);
        });
      }
    });
    return;
  } else if(places.indexOf(country) > 0 && e.target.className == 'btn btn-danger button-remove')  {
    queue.remove();
    target.textContent = 'Add to Itinerary';
    target.className = 'btn btn-warning add-button';
  }
}

function displayFilters(name, className) {
  var anchor = document.getElementsByClassName('sidebar-top')[0];
  var sideBar = document.getElementsByClassName('sidebar')[0];
  htmlBlock('span', [['class', 'login-panel']], name, htmlBlock('div', [['class', className]], '', anchor));
  htmlBlock('div', [['class', 'view-itinerary']], 'View Itinerary', anchor);
  var continent = htmlBlock('div', [['id', 'isotope-filters'],['class', 'button-group filters-button-group'],['data-filter-group', 'continent']], '', sideBar);
  htmlBlock('h3', [['class', 'continents']], 'Continents', continent);
  htmlBlock('div', [['class', 'filter-button is-checked'], ['data-filter', ""]], 'Any', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".af"]], 'Africa', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".as"]], 'Asia', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".eu"]], 'Europe', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".oc"]], 'Oceana', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".na"]], 'North America', continent);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".sa"]], 'South America', continent);
  var safety = htmlBlock('div', [['id', 'isotope-filters'],['class', 'button-group filters-button-group'],['data-filter-group', 'safety']], '', sideBar);
  htmlBlock('h3', [['class', 'safety']], 'Safety', safety);
  htmlBlock('div', [['class', 'filter-button is-checked'], ['data-filter', ""]], 'Any', safety);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".safe"]], 'Stable', safety);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".warning"]], 'Unstable', safety);
  var language = htmlBlock('div', [['id', 'isotope-filters'],['class', 'button-group filters-button-group'], ['data-filter-group', 'language']], '', sideBar);
  htmlBlock('h3', [['class', 'language']], 'Language', language);
  htmlBlock('div', [['class', 'filter-button is-checked'], ['data-filter', ""]], 'Any', language);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".arabic"]], 'Arabic', language);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".english"]], 'English', language);
  htmlBlock('div', [['class', 'filter-button'], ['data-filter', ".spanish"]], 'Spanish', language);
}

function getCountry(country, iso)  {
  country.forEach(function(item) {
    var country = new Country(item);
    var continent = country.normalize(country.continent);
    var language = country.normalize(country.language);
    var advise = country.normalize(country.advise);
    var flag = country.normalize(country.flag);
    var name  = country.normalize(country.name);

    var attributes = [['class', 'grid-item-content continent safety ' + continent + ' ' + language + ' ' + advise],['data-country', name]]
    var grid = document.getElementsByClassName('grid')[0];
    var container = htmlBlock('div', [['class', 'grid-item']], '', grid);
    var gridItem = htmlBlock('div', attributes, '', container);
    htmlBlock('img', [['class', 'flag-image'],['src', 'images/' + flag + '.png']], '', gridItem);
    htmlBlock('div', [['class', 'country']], country.name, gridItem);
    container.appendChild(gridItem);
    iso.appended(gridItem);
    iso.layout();
  });
}

function initWell() {
  var well = htmlBlock('div', [['class', 'well itinerary']], '', itinerary);
  var top = htmlBlock('div', [['class', 'well-top']], '', well);
  var row = htmlBlock('div', [['class', 'row']], '', well);
  htmlBlock('h2', [], 'Add to Itinerary', top);
  htmlBlock('button', [['class', 'btn btn-default btn-lg'], ['id', 'return-countries']], 'Return', htmlBlock('div', [['class', 'col-md-1']], '', row));
  htmlBlock('button', [['class', 'btn btn-default btn-lg'], ['id', 'submit-itinerary']], 'Submit', htmlBlock('div', [['class', 'col-md-offset-9 col-md-1']], '', row));
}

function itineraryRow(name, countries) {
  var image = countries.filter(function(item) {
    var countryName = item.name.toLowerCase();
    if(countryName == name) {
      return item;
    }
  });
  var flag = image[0].img.toLowerCase();
  console.log(flag);
  var country = name;
  var anchor = document.getElementsByClassName('well-top')[0];
  var row = htmlBlock('div', [['class', 'row']], '', anchor);
  var outer = htmlBlock('div', [['class', 'outer']], '', row);

  var columnOne = htmlBlock('div', [['class', 'col-md-3']], '', outer);
  var tableOne = htmlBlock('table', [['class', 'country-table']], '', columnOne);
  var rowOne = htmlBlock('tr', [], '', tableOne);

  htmlBlock('img', [['src', 'small/' + flag + '.png']], '', htmlBlock('div', [['class', 'small-flag']], '', htmlBlock('td', [], '', rowOne)));
  htmlBlock('div', [['class', 'country-name']], country, htmlBlock('td', [], '', rowOne));

  var columnTwo = htmlBlock('div', [['class', 'col-md-4']], '', outer);
  var tableTwo = htmlBlock('table', [['class', 'country-table']], '', columnTwo);
  var rowTwo = htmlBlock('tr', [], '', tableTwo);

  htmlBlock('div', [['class', 'start-date']], 'Start Date', htmlBlock('td', [], '', rowTwo));
  htmlBlock('input', [['class', 'start-date-picker-' + country], ['type', 'date']], '', htmlBlock('td', [], '', rowTwo));


  var columnThree = htmlBlock('div', [['class', 'col-md-4']], '', outer);
  var tableThree = htmlBlock('table', [['class', 'country-table']], '', columnThree);
  var rowThree = htmlBlock('tr', [], '', tableThree);

  htmlBlock('div', [['class', 'end-date']], 'End Date', htmlBlock('td', [], '', rowThree));
  htmlBlock('input', [['class', 'end-date-picker-' + country], ['type', 'date']], '', htmlBlock('td', [], '', rowThree));

  var columnFour = htmlBlock('div', [['class', 'col-md-1']], '', outer);

  htmlBlock('button', [['class', 'btn btn-default country-button ' + country], ['type', 'button']], 'Add', columnFour);
  var startDate = document.getElementsByClassName('start-date-picker-' + country)[0];
  var endDate = document.getElementsByClassName('end-date-picker-' + country)[0];
  var button = document.getElementsByClassName('btn btn-default country-button ' + country)[0];
  button.addEventListener('click', function(e)  {
    var start = startDate.value;
    var end = endDate.value;
    var trip = new Trip(country, start, end);
    trip.addTrip();
  });
}

function overlay(e) {
  var theParent = e.target.offsetParent;
  var element = e.target.nodeName;
  var height = e.target.clientHeight;
  var width = e.target.clientWidth;
  var country = e.target.offsetParent.dataset.country;
  if(theParent.classList.contains('grid-item-content') && element == 'IMG') {
    var message = 'View Details';
    var pointer = 'cursor: pointer';
    var overLayStyles = [['class', 'overlay'], ['style', 'position: absolute; background-color: rgba(0,0,0,.35); height: ' + height + 'px; width: ' + width + 'px; top: 0px;']];
    var overLayTextStyles = [['class', 'overlay country-details'], ['style', 'position: absolute; color: white; top: ' + height/3 + 'px; left: 25%;' + pointer]];
    var overlay = htmlBlock('div', overLayStyles, '', theParent);
    var overlayText = htmlBlock('h4', overLayTextStyles, message, theParent);
  }
  theParent.addEventListener('mouseleave', function(e) {
    $('.overlay').remove();
  }, false);
}
function initDetails(e) {
  if(e.target.classList.contains('country-details'))  {
    clearChildren(itinerary);
    console.log('country-details');
    var country = e.target.offsetParent.dataset.country;
    console.log(e.target.offsetParent);
    var call = new Call('GET');
    call.path = '/countries/short/' + country;
    call.request(function(result) {
      countryDetails(result);
    });
  } else if(e.target.className == 'close')  {
    clearChildren(details);
  }
}
function countryDetails(data)  {
  clearChildren(details);
  var country = new Country(data);
  var container = htmlBlock('div', [['class', 'well details']], '', details);
  var inner = htmlBlock('div', [['class', 'inner']], '', container);
  htmlBlock('button', [['type', 'button'], ['class', 'close'], ['aria-label', 'Close']], 'x', inner);
  htmlBlock('h2', [], country.name, inner);
  htmlBlock('div', [['class', 'btn btn-warning add-button'], ['data-country', country.normalize(country.name)]], 'Add to Itinerary', inner);

  var row = htmlBlock('div', [['class', 'row']], '', inner);
  var left = htmlBlock('div', [['class', 'col-md-6']], '', row);

  var innerOne = htmlBlock('div', [['class', 'inner-container']], '', left);
  htmlBlock('h4', [], 'Official Language', innerOne);
  htmlBlock('p', [], country.language, innerOne);

  var innerTwo = htmlBlock('div', [['class', 'inner-container']], '', left);
  htmlBlock('h4', [], 'Timezone', innerTwo);
  htmlBlock('p', [], country.timezone, innerTwo);

  var innerThree = htmlBlock('div', [['class', 'inner-container']], '', left);
  htmlBlock('h4', [], 'Electricity', innerThree);
  htmlBlock('p', [], 'Voltage: ' + country.voltage, innerThree);
  htmlBlock('p', [], 'Frequency: ' + country.frequency, innerThree);
  htmlBlock('a', [['class', 'btn btn-default btn-xs'], ['role', 'button'], ['data-toggle', 'collapse'], ['href', '#plugs-' + country.name]], 'View Plugs', innerThree);

  var innerFour = htmlBlock('div', [['class', 'inner-container']], '', left);
  var theNews = htmlBlock('div', [['class', 'news']], '', innerFour);

  var newsInit = function(data)  {
    var news = new News(data);
    var anchor = document.getElementsByClassName('news')[0];
    htmlBlock('h4', [], 'Headlines', anchor);
    console.log(news.story);
    for(var i = 0; i < news.story.length; i++)  {
      htmlBlock('p', [], news.story[i].title, htmlBlock('a', [['href', news.story[i].url]], '', anchor));
    }
  }
  // var call = new Call('GET');
  // call.path = '/news/' + country.name;
  //
  // call.request(function(result) {
  //   if(theNews) {
  //     newsInit(result);
  //   }
  // });

  var plugs = htmlBlock('div', [['class', 'collapse'], ['id', 'plugs-' + country.name]], '', innerThree);
  var plugsWell = htmlBlock('div', [['class', 'well']], '', plugs);
  for(var i = 0; i < country.plugs.length; i++)  {
    let plug = htmlBlock('div', [['class', 'plug']], '', plugsWell);
    htmlBlock('p', [], 'Plug Type ' + country.plugs[i], plug);
    htmlBlock('img', [['src', country.plugImage[i]], ['alt', country.plugs[i]]], '', plug);
  };

  var right = htmlBlock('div', [['class', 'col-md-6 right']], '', row);

  var oneInner = htmlBlock('div', [['class', 'inner-container']], '', right);
  htmlBlock('h4', [], 'Vaccination Requirements', oneInner);
  if(country.vaccinations == 'None')  {
    htmlBlock('p', [], 'None', oneInner);
  } else {
    for(var i = 0; i < country.vaccinations.length; i++)  {
      let prefix = country.vaccinations[i].name.slice(0, 3).toLowerCase();
      let suffix = country.vaccinations[i].name.slice(-1).toLowerCase();
      var vacContainer = htmlBlock('div', [['class', 'vaccinations']], '', oneInner);
      htmlBlock('span', [], country.vaccinations[i].name, vacContainer);
      htmlBlock('a', [['class', 'btn btn-default btn-xs'], ['role', 'button'], ['data-toggle', 'collapse'], ['href', '#' + prefix + suffix]], 'Details', vacContainer);
      let vaccine = htmlBlock('div', [['class', 'collapse'], ['id', prefix + suffix]], '', vacContainer);
      htmlBlock('p', [], country.vaccinations[i].message, htmlBlock('div', [['class', 'well']], '', vaccine));
    }
  }

  var twoInner = htmlBlock('div', [['class', 'inner-container']], '', right);
  htmlBlock('h4', [], 'Safety Concerns', twoInner);
  htmlBlock('span', [], country.water, htmlBlock('p', [], 'Water: ', twoInner));
  htmlBlock('span', [], country.advise, htmlBlock('p', [], 'Political Climate: ', twoInner));

}

// Helper functions ***************************//
// ******************************************//
function createEl(tag, parent)  {
  var newElement = document.createElement(tag);
  return parent.appendChild(newElement);
}

function addText(text, parent) {
  return parent.textContent = text;
}

function addAttribute(attributes, parent) {
  for(var i = 0; i < attributes.length; i++) {
    parent.setAttribute(attributes[i][0], attributes[i][1]);
  }
}

function htmlBlock(element, attr, text, parent) {
  var el = createEl(element, parent);
  addText(text, el);
  addAttribute(attr, el);
  return el;
}

function toggleClass(element, name) {
  var classArray = element.className.split(' ');
  if(element.className === '')  {
      element.className = name;
      return;
  } else if (classArray.indexOf(name) === -1) {
      classArray.push(name);
      element.className = classArray.join(' ');
  } else {
      var arrayIndex = classArray.indexOf(name);
      var deleteItem = classArray.splice(arrayIndex, 1);
      element.className = classArray.join(' ');
    }
}

function upperCase(text) {
  text = text.toLowerCase().split(' ');
  for(var i = 0; i < text.length; i++){
    text[i] = text[i].split('');
    text[i][0] = text[i][0].toUpperCase();
    text[i] = text[i].join('');
  }
  return text.join(' ');
}

function clearChildren(container)  {
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
