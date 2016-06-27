var body = document.body;

window.addEventListener('load', function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://restcountries.eu/rest/v1/all', true);
  xhr.send();
  xhr.addEventListener('load', function(e)  {
    console.log(xhr.responseURL);
    var countries = JSON.parse(xhr.responseText);
    countries.forEach(function(item)  {
      console.log(item.name);
    });
  });
});
