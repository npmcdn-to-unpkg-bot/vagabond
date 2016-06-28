var body = document.body;
var grid = document.getElementsByClassName('grid')[0];
var itinerary = document.getElementById('itinerary');
var places = [];

initCountries();

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
    return;
  }
});

body.addEventListener('mouseover', function(e)  {
  overlay(e);
});

body.addEventListener('click', function(e)  {
  var country = e.target.offsetParent.dataset.country;
  console.log(country);
});


function login(value) {
  var anchor = document.getElementsByClassName('sidebar')[0];
  if(value.length > 0)  {
    var className = 'user';
  } else {
    className = 'login';
  }
  htmlBlock('span', [], value, htmlBlock('div', [['class', className]], '', anchor));
}

function initCountries()  {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/countries');
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    console.log(xhr.responseURL);
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
}

var africa = new Trip();

function overlay(e) {
  var theParent = e.target.offsetParent;
  var element = e.target.nodeName;
  var height = e.target.clientHeight;
  var width = e.target.clientWidth;
  if(theParent.className == 'grid-item-content' && element == 'IMG') {
    var overLayStyles = [['class', 'overlay'], ['style', 'position: absolute; background-color: rgba(0,0,0,.35); height: ' + height + 'px; width: ' + width + 'px; top: 0px;']];
    var overLayTextStyles = [['class', 'overlay'], ['style', 'position: absolute; color: white; top: ' + height/3 + 'px; left: 25%']];
    var overlay = htmlBlock('div', overLayStyles, '', theParent);
    var overlayText = htmlBlock('h4', overLayTextStyles, 'Add to Itinerary', theParent);
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
