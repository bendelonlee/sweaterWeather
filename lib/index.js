// This file is in the entry point in your webpack config.
import './styles.scss';

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
  debugger;

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


function loadpage(location) {
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
  loadBackground('sky.jpeg')
  loadPreviousSearch()
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

  $('#register-button').click(function () {
    $('#register-dialogue').load('register-form.html', function () {
      $(this).find('.submit-button').click(function functionName() {
        registerUser($('#registration-email').val(), $('#registration-password').val(), $('#registration-password-confirmation').val())
      });
    });
  });


});

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
  console.log(email, password, passwordConfirmation);
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
  $('#logout-button').show();
  $('#register-dialogue').slideUp(1000);
}

function renderFlash(message) {
  $('#flash').html(message);
  $('#flash').fadeIn('fast');
  setTimeout(function () {
    $('#flash').fadeOut(7000);
  }, 10000)
}
