var body = document.body;
var grid = document.getElementsByClassName('grid')[0];

window.addEventListener('load', function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/countries');
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    console.log(xhr.responseURL);
    var countries = JSON.parse(xhr.responseText);
    isoItems(countries);
  });
});

function isoItems(country) {
  var iso = new Isotope('.grid');
  country.forEach(function(item) {
    var flag = item.img.toLowerCase();
    var container = htmlBlock('div', [['class', 'grid-item']], '', grid);
    var gridItem = htmlBlock('div', [['class', 'grid-item-content']], '', container);
    htmlBlock('img', [['src', 'images/' + flag + '.png']], '', gridItem);
    htmlBlock('div', [['class', 'country']], item.name, gridItem);
    container.appendChild(gridItem);
    iso.appended(gridItem);
    iso.layout();
  });
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
