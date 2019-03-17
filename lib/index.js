// This file is in the entry point in your webpack config.
import './styles.scss';
import { registrationHtml } from './html/registration-html.js';
import { favoriteHtml } from './html/favorite-html.js';
import { loginHtml } from './html/login-html.js';
import { navHtml } from './html/nav-html.js';
import { iconPaths } from './icon-paths.js';

import {forecastDayHtml} from './html/forecast-day-html.js'
import {forecastHourHtml} from './html/forecast-hour-html.js'

const backendAddress = 'https://fast-inlet-92320.herokuapp.com';

function loadForecast(location) {
  $('#current-weather').load("current-weather.html")
  $('#weather-details').load("weather-details.html")
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
    renderWeather(myJson);
  });
};

function renderWeather(weather) {
  renderCurrentWeather(weather);
  renderDetails(weather);
  renderForecastDays(weather);
  renderForecastHours(weather);
}

function renderDetails(weather) {
  $("#feels-like").html(weather.current_hour.feels_like);
  $("#humidity").html(weather.current_hour.humidity);
  $("#visibility").html(weather.current_hour.visibility);
  $("#uv-index").html(weather.current_hour.uv_index);
  $("#today-full-summary").html(weather.day_summary);
}

function renderForecastDays(weather) {
  weather.days.shift();
  weather['days'].forEach(function (day, index) {
    $('#forecast-days').append(`<tr id="forecast-day-${index}"></tr>`)
    day = $(`#forecast-day-${index}`)
    day.append(forecastDayHtml(iconPaths[weather.days[index].icon]))
    day.find('.forecast-day-name').html(weather['days'][index]["day_of_week"]);
    day.find('.forecast-day-high').html(weather['days'][index]["high"]);
    day.find('.forecast-day-low').html(weather['days'][index]["low"]);
    day.find('.forecast-day-precip-probability').html(weather['days'][index]["precip_probability"]);
  });
}

function renderForecastHours(weather) {
  weather['hours'].forEach(function (hour, index) {
    $('#forecast-hours').append(`<td id="forecast-hour-${index}"></td>`);
    let hour =  $(`#forecast-hour-${index}`)
    hour.append(forecastHourHtml(iconPaths[weather.hours[index].icon]));
    hour.find('.hour-time').html(weather['hours'][index]['time_of_day']);
    hour.find('.hour-temp').html(weather['hours'][index]['temperature']);
  });
}

function renderCurrentWeather(weather) {
  $('#current-weather').attr('data', weather.city.id)

  $('#city-name').html(weather['city']['city_name'])
  $('#state-name').html(weather['city']['state'])
  $('#country-name').html(weather['city']['country'])
  $('#current-time').html(weather['current_time'])
  $('#current-summary').html(weather['current_hour']["summary"])
  $('#current-temperature').html(weather['current_hour']["temperature"] + "°F")
  $('#current-high').html(weather["current_day"]["high"] + "°F")
  $('#current-low').html(weather["current_day"]["low"] + "°F")
  starSetup();
  loadFavorites();
}

function starSetup() {
  starListener();
}

function starListener() {
  $(".fa-star").click(function (e) {
    $(this).css('font-weight', 'bold')
    addFavorite($('#current-weather').attr('data'))
  });
}

function addFavorite(cityId) {
  fetch(`${backendAddress}/api/v1/favorites?api_key=${apiKey()}&city_id=${cityId}`, {
    method: 'Post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    renderFlash(myJson.success);
    loadFavorites();
  });
}

function loadpage(location) {
  loginListener();
  loadBackgroundFromLocation(location);
  $('#weather-info').load('weather-info.html', function() {
    loadForecast(location);
  });
}

function loadBackgroundFromLocation(location) {
  fetch(`${backendAddress}/api/v1/background?location=${location}`, {
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
    loadBackground(myJson.source);
  });
}

function loadBackground(url) {
  $("body").css('background-image', `url("${url}")`)
}

function setCookie() {
  document.cookie = `lastSearch=${$('#location-input').val()};`;
}

function lastSearch() {
  return document.cookie.match(/(?<=lastSearch=)\w+/);
}

function loadPreviousSearch() {
  let match = lastSearch();
  if(match != null) {
    loadpage(match[0])
  }
}

$(document).ready(function() {
  $('body').prepend(navHtml());
  loadBackground('sky.jpeg');
  loadPreviousSearch();
  if(document.cookie.match(/(?<=apiKey=)\w+/)) {
    renderLoggedInPage();
  }
  $('#search-button').click(function () {
    setCookie();
    loadpage($("#location-input").val());
  });
  $('#location-input').keyup(function (key) {
    if (key.which == 13) {
      setCookie();
      loadpage($("#location-input").val());
    }
  });
  registerListener();
});

function registerListener() {
  $('#register-button').click(function () {
    if ($("#register-dialogue").is(':empty')) {
      $("#register-dialogue").append(registrationHtml());
    }
    $("#register-dialogue").slideDown(700);
    $("#register-dialogue").find('.submit-button').click(function () {
      registerUser($('#registration-email').val(), $('#registration-password').val(), $('#registration-password-confirmation').val());
    });
    $('.fa-window-close').mouseup(function () {
      $("#register-dialogue").fadeOut(1000)
    });
  });
}

function loginListener() {
  $('#login-button').mouseup(function () {
    if ($("#login-dialogue").is(':empty')) {
      $("#login-dialogue").append(loginHtml());
    }
    $("#login-dialogue").slideDown(700);
    $("#login-dialogue").find('.submit-button').click(function () {
      loginUser($('#login-email').val(), $('#login-password').val())
    });
    $('.fa-window-close').click(function () {
      $("#login-dialogue").fadeOut(1000)
    });
  });
}

function loginUser(email, password) {
  fetch(`${backendAddress}/api/v1/sessions?email=${email}&password=${password}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    handleLoginResponse(myJson);
  })
  .catch(function (errors) {
    renderFlash("Unrecognized username or password", "red")
  });
}

function registerUser(email, password, passwordConfirmation) {
  fetch(`${backendAddress}/api/v1/users?email=${email}&password=${password}&password_confirmation=${passwordConfirmation}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    handleRegisterResponse(myJson);
  });
}

function handleRegisterResponse(response) {
  let apiKey = response["api_key"];
  if(apiKey === undefined) {
    renderFlash('Registration Failed.');
  } else {
    renderFlash('Registration Success!');
    document.cookie = `apiKey=${apiKey}`
  }
  $('#register-button').hide();
  $('#login-button').hide();
  showLogout();
  $('#register-dialogue').slideUp(1000);
}

function handleLoginResponse(response) {
  let apiKey = response["api_key"];
  if(apiKey === undefined) {
    renderFlash('Login Failed.');
  } else {
    renderFlash('You are now logged in!');
    document.cookie = `apiKey=${apiKey}`
  }
  renderLoggedInPage();
  $('#login-dialogue').slideUp(1000);
}

function renderLoggedInPage() {
  $('#register-button').hide();
  $('#login-button').hide();
  showLogout();
}

function showLogout() {
  $('#logout-button').show();
  $('#logout-button').mouseup( function () {
    document.cookie = "apiKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    $('#register-button').show();
    $('#login-button').show();
    $('#logout-button').hide();
    renderFlash('You have logged out');
  });
}

function renderFlash(message, color = "lightgreen") {
  $('#flash').html(message);
  $('#flash').css("background-color", color);
  $('#flash').fadeIn('fast');
  setTimeout(function () {
    $('#flash').fadeOut(7000);
  }, 10000)
}

function apiKey() {
  let match = document.cookie.match(/(?<=apiKey=)[\w\.-]+/)
  if (match) {
    return match[0];
  }
}

function loadFavorites() {
  if (apiKey() === undefined) return null;
  fetch(`${backendAddress}/api/v1/favorites?api_key=${apiKey()}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    renderFavorites(myJson);
  })
}

function renderFavorites(weather) {
  $('#favorites').empty();
  let ids = [];
  weather.forEach( (city_weather) => {
    $('#favorites').append(favoriteHtml(city_weather));
    ids.push(city_weather.id);
  });

  if (ids.includes(parseInt($('#current-weather').attr('data')))) {
    $('.fa-star').off('click')
    $('.fa-star').css('font-weight', 'bold')
  }
}
