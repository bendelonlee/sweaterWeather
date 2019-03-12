// This file is in the entry point in your webpack config.
import './styles.scss';

const backendAddress = 'https://fast-inlet-92320.herokuapp.com';

function loadForecast() {
  $('#forecast').load("forecast.html")
  fetchWeather("Denver");
}

function fetchWeather(location) {
  fetch(`${backendAddress}/api/v1/forecast?location=${location}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    renderWeatherDetails(myJson);
  });
};

function renderWeatherDetails(weather) {
  $('#city-name').html(weather['city']['city_name'])
  $('#state-name').html(weather['city']['state'])
  $('#country-name').html(weather['city']['country'])
  $('#current-summary').html(weather['current_hour']["summary"])
  $('#current-temperature').html(weather['current_hour']["temperature"] + "°")
  $('#current-high').html(weather["current_day"]["high"] + "°")
  $('#current-low').html(weather["current_day"]["low"] + "°")
  debugger;
}



$(document).ready(function() {
  debugger;
  loadForecast();


});
