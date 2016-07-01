var body = document.body;
var countries = document.getElementById('countries');
var itinerary = document.getElementById('itinerary');
var places = [];
var schedule = [];
var currentUser = [];

initCountries();

window.addEventListener('load', function(e) {
  checkUser(e);
});

body.addEventListener('mouseover', function(e)  {
  overlay(e);
});

body.addEventListener('click', function(e)  {
  queue(e);
  removeButton(e);
  initItinerary(e);
  initPlaces(e, places);
  returnCountries(e);
});

var Itinerary = function(name, schedule)  {
  var self = this;
  this.name = name;
  this.schedule = schedule;
  this.setItinerary = function()  {
    var message = [this.name, this.schedule];
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/itinerary/post');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(message));
  }
}

function initItinerary(e)  {
  if(e.target.id == 'submit-itinerary') {
    var itinerary = new Itinerary(currentUser[0], schedule);
    itinerary.setItinerary();
  }
  else {
    return;
  }
}

function checkUser(e) {
  if(document.cookie) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/check/' + document.cookie);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send();
    xhr.addEventListener('load', function(e) {
      var user = JSON.parse(xhr.responseText);
      if(user.username.length > 0) {
        checkIn(user);
        var message = 'Welcome, ' + user.username;
      } else {
        message = 'Login';
      }
      displayName(message);
    });
  } else {
    displayName('Login');
  }
}

function checkIn(user)  {
  if(currentUser.length <  1)  {
    currentUser.push(user.username);
    user.queue.forEach(function(item) {
      places.push(item);
    });
  } else {
    return;
  }
}

function removeButton(e) {
  var theParent = e.target.parentElement;
  var country = e.target.dataset.button;
  if(theParent.className == 'button-parent')  {
    clearChildren(theParent);
    removeQueue(country);
  }
}

function removeQueue(country)  {
  var index = places.indexOf(country);
  if(index > -1)  {
    places.splice(index, 1);
  }
  var message = {};
  message.country = country;
  message.user = currentUser[0];
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', '/queue/delete');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(message));
  xhr.addEventListener('load', function(e)  {
    var message = xhr.responseText;
    console.log(message);
  });
}

function queue(e) {
  var theParent = e.target.offsetParent;
  var country = e.target.offsetParent.dataset.country;
  if(places.indexOf(country) == -1 && e.target.nodeName == 'H4'){
    htmlBlock('button', [['class', 'btn btn-danger btn-xs remove-button'], ['data-button', country]], 'Remove', htmlBlock('div', [['class', 'button-parent']], '', theParent));
    var countryLower = country.toLowerCase();
    queueAdd(countryLower);
  }
}

function queueAdd(country)  {
  places.push(country);
  var message = {};
  message.country = country;
  message.user = currentUser[0];
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', '/queue/put');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(message));
  xhr.addEventListener('load', function(e)  {
    var message = xhr.responseText;
    console.log(message);
  });
}

function displayName(value) {
  var anchor = document.getElementsByClassName('sidebar-top')[0];
  var sideBar = document.getElementsByClassName('sidebar')[0];
  if(value.length < 1 || value == 'Login')  {
    var className = 'login';
  } else {
    className = 'user';
  }
  htmlBlock('span', [], value, htmlBlock('div', [['class', className]], '', anchor));
  htmlBlock('div', [['class', 'view-itinerary']], 'View Itinerary', anchor);
  var continent = htmlBlock('div', [['id', 'isotope-filters'],['class', 'button-group filters-button-group'],['data-filter-group', 'continent']], '', sideBar);
  htmlBlock('h3', [['class', 'continents']], 'Continents', continent);
  htmlBlock('div', [['class', 'button is-checked'], ['data-filter', ""]], 'Any', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".af"]], 'Africa', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".as"]], 'Asia', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".eu"]], 'Europe', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".oc"]], 'Oceana', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".na"]], 'North America', continent);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".sa"]], 'South America', continent);
  var safety = htmlBlock('div', [['id', 'isotope-filters'],['class', 'button-group filters-button-group'],['data-filter-group', 'safety']], '', sideBar);
  htmlBlock('h3', [['class', 'safety']], 'Safety', safety);
  htmlBlock('div', [['class', 'button is-checked'], ['data-filter', ""]], 'Any', safety);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".safe"]], 'Stable', safety);
  htmlBlock('div', [['class', 'button'], ['data-filter', ".warning"]], 'Unstable', safety);

}

function returnCountries(e) {
  if(e.target.id == 'return-countries') {
    clearChildren
    initCountries(itinerary);
  } else {
    return;
  }
}

function initCountries()  {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/countries');
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    var countries = JSON.parse(xhr.responseText);
    // console.log(countries[0].language.language);
    isoItems(countries);
  });
}

function isoItems(country) {
  var grid = htmlBlock('div', [['class', 'grid']], '', countries);
  var iso = new Isotope('.grid', {
    itemSelector: '.grid-item-content'
  });
  var filterFunctions = {};
  function concatValues(obj) {
    var value = '';
    for (var prop in obj) {
      value += obj[prop];
  }
  return value;
}
  body.addEventListener('click', function(e) {
    if(e.className == 'button-group filters-button-group')  {
      if (!matchesSelector(e.target, 'div')) {
        return;
      }
    }
    var buttonGroup = e.target.parentElement;
    var filterGroup = buttonGroup.getAttribute('data-filter-group');
    filterFunctions[filterGroup] = e.target.getAttribute('data-filter');

    var filterValue = concatValues(filterFunctions);
    iso.arrange({ filter: filterValue });
  });
  country.forEach(function(item) {
    var continent = item.continent.toLowerCase()
    if(item.language[0])  {
      var language = item.language[0].language.toLowerCase();
    } else {
      language = 'none';
    }
    if(item.advise) {
      var advise = item.advise.advise.toLowerCase();
    } else {
      advise = 'safe';
    }
    var attributes = [['class', 'grid-item-content continent safety ' + continent + ' ' + language + ' ' + advise],['data-country', item.name]]
    var flag = item.img.toLowerCase();
    var name  = item.name.toLowerCase();
    var container = htmlBlock('div', [['class', 'grid-item']], '', grid);
    var gridItem = htmlBlock('div', attributes, '', container);
    htmlBlock('img', [['class', 'flag-image'],['src', 'images/' + flag + '.png']], '', gridItem);
    htmlBlock('div', [['class', 'country']], item.name, gridItem);
    container.appendChild(gridItem);
    iso.appended(gridItem);
    iso.layout();
  });
}

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
  this.log = function() {
    console.log(this.destination);
    console.log(this.startDate());
    console.log(this.endDate());
  }
  this.trip = {};

  this.addTrip = function() {
    this.trip.id = Date.now();
    this.trip.country = this.destination;
    this.trip.startDate = this.startDate();
    this.trip.endDate = this.endDate();

    schedule.push(this.trip);
    var package = [this.trip, currentUser[0]];
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/schedule/put');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(package));
    xhr.addEventListener('load', function(e)  {
      console.log(xhr.responseText);
    });
    return;
  }
}

function initPlaces(e, array) {
  if(e.target.className == 'view-itinerary')  {
    clearChildren(countries);
    clearChildren(itinerary);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/countries');
    xhr.send();
    xhr.addEventListener('load', function(e)  {
      initWell();
      var countries = JSON.parse(xhr.responseText);
      array.forEach(function(item)  {
        itineraryRow(item, countries);
      });
    });
  }
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
  // htmlBlock('h4',[], 'Add to Itinerary', anchor);
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
    trip.log();
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
    if(places.indexOf(country) != -1) {
      var message = 'You have already added '  + country;
      var pointer = 'cursor: not-allowed;';
    } else {
      message = 'Add to Itinerary';
      pointer = 'cursor: pointer;';
    }
    var overLayStyles = [['class', 'overlay'], ['style', 'position: absolute; background-color: rgba(0,0,0,.35); height: ' + height + 'px; width: ' + width + 'px; top: 0px;']];
    var overLayTextStyles = [['class', 'overlay'], ['style', 'position: absolute; color: white; top: ' + height/3 + 'px; left: 25%;' + pointer]];
    var overlay = htmlBlock('div', overLayStyles, '', theParent);
    var overlayText = htmlBlock('h4', overLayTextStyles, message, theParent);
  }
  theParent.addEventListener('mouseleave', function(e) {
    $('.overlay').remove();
  }, false);
}


// Misc functions
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

function clearChildren(container)  {
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
