// This file is in the entry point in your webpack config.
import './styles.scss';
import { registrationHtml } from './html/registration-html.js';
import { favoriteHtml } from './html/favorite-html.js';
import { loginHtml } from './html/login-html.js';
import { navHtml } from './html/nav-html.js';
import { iconPaths } from './icon-paths.js';

import {forecastDayHtml} from './html/forecast-day-html.js'
import {forecastHourHtml} from './html/forecast-hour-html.js'
import {currentWeatherHtml} from './html/current-weather-html.js'

const backendAddress = 'https://fast-inlet-92320.herokuapp.com';

function loadForecast(location) {
  $('#weather-details-container').load("weather-details.html")
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
  $("#feels-like").html(parseInt(weather.current_hour.feels_like )+ "°F");
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
    day.find('.forecast-day-high').html(weather['days'][index]["high"] + "°F");
    day.find('.forecast-day-low').html(weather['days'][index]["low"] + "°F");
    day.find('.forecast-day-precip-probability').html(weather['days'][index]["precip_probability"] + "<span class='small-text'> chance of " + weather['days'][index]["precip_type"] + "</span>");
    day.find('.forecast-day-low').html();
  });
}

function renderForecastHours(weather) {
  weather['hours'].forEach(function (hour, index) {
    $('#forecast-hours').append(`<td id="forecast-hour-${index}" class="forecast-hour-data"</td>`);
    let hourDOM = $(`#forecast-hour-${index}`);
    hourDOM.append(forecastHourHtml(iconPaths[weather.hours[index].icon]));
    hourDOM.find('.hour-time').html(weather['hours'][index]['time_of_day']);
    hourDOM.find('.hour-temp').html(weather['hours'][index]['temperature']+ "°F");
  });
}

function renderCurrentWeather(weather) {
  let iconPath = iconPaths[weather.current_hour.icon]
  $('#current-weather').empty()
  $('#current-weather').append(currentWeatherHtml(iconPath))
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
  $('.current-star').css('font-weight', 'normal');
  starListener();
}

function isLoggedIn() {
  let match = document.cookie.match(/(?<=apiKey=)[\w\.-]+/)
  if(match == null) {
    return false;
  } else {
    return true;
  }
}

function starListener() {
  $(".current-star").click(function (e) {
    if(isLoggedIn() == true) {
      $(this).css('font-weight', 'bold')
      addFavorite($('#current-weather').attr('data'))
    } else {
      logInMessage();
    }
  });
}

function logInMessage() {
  renderFlash("To favorite a city, you must be logged in", "lightgrey")
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
  $('nav').css('position', 'static');
  $('#intro').hide();
  loginListener();
  loadBackgroundFromLocation(location);
  $('#forecast-container').load('forecast.html', function() {
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
  setUpNav();
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

function setUpNav() {
  $('body').prepend(navHtml());
  if(anySearch()) {
    $('nav').center();
  }
}

function anySearch() {
  let match = document.cookie.match(/(?<=lastSearch=)[\w\.-]+/)
  if(match == null) {
    return true;
  } else {
    return false;
  }
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
}

function registerListener() {
  $('#register-button').click(function () {
    if ($("#register-dialogue").is(':empty')) {
      $("#register-dialogue").append(registrationHtml());
    }
    $('#login-dialogue').hide();
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
    $('#register-dialogue').hide();
    $("#login-dialogue").find('.submit-button').click(function () {
      loginUser($('#login-email').val(), $('#login-password').val())
    });
    $('.fa-window-close').click(function () {
      $("#login-dialogue").fadeOut(1000)
    });
  });
}

function loginUser(email, password) {
  $('#favorites-container').show();
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
    $('#favorites-container').hide();
    renderFlash('You have logged out');
  });
}

function renderFlash(message, color = "lightgreen") {
  $('#flash').html(message);
  let width = $('#flash').width();
  $('#flash').css('margin-left', width * -0.5);
  $('#flash').css("background-color", color);
  $('#flash').fadeIn('fast');
  setTimeout(function () {
    $('#flash').fadeOut(1000);
  }, 4000)
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
    addFavoriteDeleteListener()
  })
}


function addFavoriteDeleteListener() {
  $(".favorite-close").mouseup(function () {
    $(this).css('font-weight', "normal")
    deleteFavorite($(this).parent().attr('data'))
    $(this).parent().fadeOut(5000);
  });
}

function deleteFavorite(city_id) {
  if (apiKey() === undefined) return null;
  fetch(`${backendAddress}/api/v1/favorites?api_key=${apiKey()}&city_id=${city_id}`, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    if (myJson.name){
      renderFlash(`${myJson.name} has been removed from your favorites.`)
      if ((myJson.id.toString()) === $('#current-weather').attr('data')) {
        starSetup();
      }
    }
    else {
      renderFlash('Server error.', 'red')
    }
  })
}

function renderFavorites(weather) {
  $('#favorites-container').empty();
  $('#favorites-container').css("display", "block");
  $('#favorites-container').append('<h2>Your Favorites</h2>');
  $('#favorites-container').append('<div id="favorites"></div>');

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
