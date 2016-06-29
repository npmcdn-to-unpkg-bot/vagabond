var body = document.body;
var grid = document.getElementsByClassName('grid')[0];
var itinerary = document.getElementById('itinerary');
var places = ['angola', 'argentina'];

// initCountries();

// $('.country-button').on('click', function(e) {
//   var end = document.getElementsByClassName('end-date-picker')[0];
//   console.log(end.value);
// });

window.addEventListener('load', function(e) {
  if(document.cookie) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/check/' + document.cookie);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send();
    xhr.addEventListener('load', function(e) {
      var user = xhr.responseText;
      if(user.length > 0) {
        var message = 'Welcome, ' + user;
      } else {
        message = 'Login';
      }
      login(message);
    });
  } else {
    login('Login');
  }
});

body.addEventListener('mouseover', function(e)  {
  overlay(e);
});

body.addEventListener('click', function(e)  {
  queue(e);
});

function queue(e) {
  var country = e.target.offsetParent.dataset.country;
  if(places.indexOf(country) == -1){
    places.push(country);
  } else {
    return;
  }
}

function login(value) {
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

var Trip = function(destination)  {
  this.destination = destination;
  this.startDate = function(year, month, day) {
     var date = new Date();
     date.setFullYear(year);
     date.setMonth(month);
     date.setDate(day);
     return date.toLocaleString('en-Us');
  }
  this.endDate = function(year, month, day) {
     var date = new Date();
     date.setFullYear(year);
     date.setMonth(month);
     date.setDate(day);
     return date.toLocaleString('en-Us');
  }
  this.log = function() {
    console.log(this.destination);
  }
}

function initPlaces(array) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/countries');
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    var countries = JSON.parse(xhr.responseText);
    array.forEach(function(item)  {
      itineraryRow(item, countries);
    });
  });
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
    if(theParent.lastChild.className =='overlay') {
      theParent.removeChild(theParent.lastChild);
    }
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
