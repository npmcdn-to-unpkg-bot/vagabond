var body = document.body;
var countries = document.getElementById('countries');
var itinerary = document.getElementById('itinerary');
var places = [];
var currentUser = [];

// initCountries();

window.addEventListener('load', function(e) {
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
});

body.addEventListener('mouseover', function(e)  {
  overlay(e);
});

body.addEventListener('click', function(e)  {
  queue(e);
  queueRemove(e);
});

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

function queueRemove(e) {
  var theParent = e.target.parentElement;
  var country = e.target.dataset.button;
  var index = places.indexOf(country);
  if(index > -1)  {
    places.splice(index, 1);
  }
  if(theParent.className == 'button-parent')  {
    clearChildren(theParent);
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
}

function queue(e) {
  var theParent = e.target.offsetParent;
  var country = e.target.offsetParent.dataset.country;
  if(places.indexOf(country) == -1 && e.target.nodeName == 'H4'){
    places.push(country);
    htmlBlock('button', [['class', 'btn btn-danger btn-xs remove-button'], ['data-button', country]], 'Remove', htmlBlock('div', [['class', 'button-parent']], '', theParent));
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
}

function displayName(value) {
  var anchor = document.getElementsByClassName('sidebar')[0];
  if(value.length < 1 || value == 'Login')  {
    var className = 'login';
  } else {
    className = 'user';
  }
  htmlBlock('span', [], value, htmlBlock('div', [['class', className]], '', anchor));
}

function initCountries()  {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/countries');
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    var countries = JSON.parse(xhr.responseText);
    isoItems(countries);
  });
}

function isoItems(country) {
  var grid = htmlBlock('div', [['class', 'grid']], '', countries);
  var iso = new Isotope('.grid');
  country.forEach(function(item) {
    var flag = item.img.toLowerCase();
    var name  = item.name.toLowerCase();
    var container = htmlBlock('div', [['class', 'grid-item']], '', grid);
    var gridItem = htmlBlock('div', [['class', 'grid-item-content'], ['data-country', name]], '', container);
    htmlBlock('img', [['class', 'flag-image'],['src', 'images/' + flag + '.png']], '', gridItem);
    htmlBlock('div', [['class', 'country']], item.name, gridItem);
    container.appendChild(gridItem);
    iso.appended(gridItem);
    iso.layout();
  });
}

var Trip = function(destination, begin, end)  {
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
}

function initPlaces(array) {
  clearChildren(countries);
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

function initWell() {
  htmlBlock('h2', [], 'Add to Itinerary', htmlBlock('div', [['class', 'well itinerary']], '', itinerary));
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
  var anchor = document.getElementsByClassName('well itinerary')[0];
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
  });
}
function overlay(e) {
  var theParent = e.target.offsetParent;
  var element = e.target.nodeName;
  var height = e.target.clientHeight;
  var width = e.target.clientWidth;
  var country = e.target.offsetParent.dataset.country;
  if(theParent.className == 'grid-item-content' && element == 'IMG') {
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
