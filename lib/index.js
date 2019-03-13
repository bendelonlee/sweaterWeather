// This file is in the entry point in your webpack config.
import './styles.scss';

const backendAddress = 'https://fast-inlet-92320.herokuapp.com';

function loadForecast(location) {
  $('#current-weather').load("current-weather.html")
  fetchWeather(location);
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
  renderCurrentWeather(weather)
  renderForecastDays(weather)
  renderForecastHours(weather)
}



function renderForecastDays(weather) {
  weather['days'].forEach(function (day, index) {
    $('#forecast-days').append(`<tr id="forecast-day-${index}"></tr>`)
    $(`#forecast-day-${index}`).load('forecast-day.html', function(){
      $(this).find('.forecast-day-name').html(weather['days'][index]["day_of_week"]);
      $(this).find('.forecast-day-high').html(weather['days'][index]["high"]);
      $(this).find('.forecast-day-low').html(weather['days'][index]["low"]);
      $(this).find('.forecast-day-precip-probability').html(weather['days'][index]["precip_probability"]);
    });
  })
}

function renderForecastHours(weather) {
  weather['hours'].forEach(function (hour, index) {
    $('#forecast-hours').append(`<td id="forecast-hour-${index}"></td>`)

    $(`#forecast-hour-${index}`).load('forecast-hour.html', function(){

      $(this).find('.hour-time').html(weather['hours'][index]['time_of_day']);
      $(this).find('.hour-temp').html(weather['hours'][index]['temperature']);
    });
  });
}

function renderCurrentWeather(weather) {
  $('#city-name').html(weather['city']['city_name'])
  $('#state-name').html(weather['city']['state'])
  $('#country-name').html(weather['city']['country'])
  $('#current-summary').html(weather['current_hour']["summary"])
  $('#current-temperature').html(weather['current_hour']["temperature"] + "°F")
  $('#current-high').html(weather["current_day"]["high"] + "°F")
  $('#current-low').html(weather["current_day"]["low"] + "°F")
}


function loadpage() {
  $('#weather-info').load('weather-info.html', function() {
    loadForecast($("#location-input").val());
  });
}

$(document).ready(function() {

  $('#search-button').click(function () {
    loadpage();
  });
  $('#location-input').keyup(function (key) {
    if (key.which == 13) {
      loadpage();
    }
  });

});
