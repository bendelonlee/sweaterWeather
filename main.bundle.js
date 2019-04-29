/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var _registrationHtml = __webpack_require__(5);

	var _favoriteHtml = __webpack_require__(6);

	var _loginHtml = __webpack_require__(7);

	var _navHtml = __webpack_require__(8);

	var _iconPaths = __webpack_require__(9);

	var _forecastDayHtml = __webpack_require__(10);

	var _forecastHourHtml = __webpack_require__(11);

	var _currentWeatherHtml = __webpack_require__(12);

	var backendAddress = 'https://fast-inlet-92320.herokuapp.com'; // This file is in the entry point in your webpack config.


	function loadForecast(location) {
	  $('#weather-details-container').load("weather-details.html");
	  fetchWeather(location);
	}

	function fetchWeather(location) {
	  fetch(backendAddress + '/api/v1/forecast?location=' + location, {
	    method: 'GET',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
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
	    $('#forecast-days').append('<tr id="forecast-day-' + index + '"></tr>');
	    day = $('#forecast-day-' + index);
	    day.append((0, _forecastDayHtml.forecastDayHtml)(_iconPaths.iconPaths[weather.days[index].icon]));
	    day.find('.forecast-day-name').html(weather['days'][index]["day_of_week"]);
	    day.find('.forecast-day-high').html(weather['days'][index]["high"]);
	    day.find('.forecast-day-low').html(weather['days'][index]["low"]);
	    day.find('.forecast-day-precip-probability').html(weather['days'][index]["precip_probability"]);
	  });
	}

	function renderForecastHours(weather) {
	  weather['hours'].forEach(function (hour, index) {
	    $('#forecast-hours').append('<td id="forecast-hour-' + index + '" class="forecast-hour-data"</td>');
	    var hourDOM = $('#forecast-hour-' + index);
	    hourDOM.append((0, _forecastHourHtml.forecastHourHtml)(_iconPaths.iconPaths[weather.hours[index].icon]));
	    hourDOM.find('.hour-time').html(weather['hours'][index]['time_of_day']);
	    hourDOM.find('.hour-temp').html(weather['hours'][index]['temperature']);
	  });
	}

	function renderCurrentWeather(weather) {
	  var iconPath = _iconPaths.iconPaths[weather.current_hour.icon];
	  $('#current-weather').append((0, _currentWeatherHtml.currentWeatherHtml)(iconPath));
	  $('#current-weather').attr('data', weather.city.id);
	  $('#city-name').html(weather['city']['city_name']);
	  $('#state-name').html(weather['city']['state']);
	  $('#country-name').html(weather['city']['country']);
	  $('#current-time').html(weather['current_time']);
	  $('#current-summary').html(weather['current_hour']["summary"]);
	  $('#current-temperature').html(weather['current_hour']["temperature"] + "°F");
	  $('#current-high').html(weather["current_day"]["high"] + "°F");
	  $('#current-low').html(weather["current_day"]["low"] + "°F");
	  starSetup();
	  loadFavorites();
	}

	function starSetup() {
	  $('.current-star').css('font-weight', 'normal');
	  starListener();
	}

	function starListener() {
	  $(".current-star").click(function (e) {
	    $(this).css('font-weight', 'bold');
	    addFavorite($('#current-weather').attr('data'));
	  });
	}

	function addFavorite(cityId) {
	  fetch(backendAddress + '/api/v1/favorites?api_key=' + apiKey() + '&city_id=' + cityId, {
	    method: 'Post',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    renderFlash(myJson.success);
	    loadFavorites();
	  });
	}

	function loadpage(location) {
	  loginListener();
	  loadBackgroundFromLocation(location);
	  $('#forecast-container').load('forecast.html', function () {
	    loadForecast(location);
	  });
	}

	function loadBackgroundFromLocation(location) {
	  fetch(backendAddress + '/api/v1/background?location=' + location, {
	    method: 'GET',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    loadBackground(myJson.source);
	  });
	}

	function loadBackground(url) {
	  $("body").css('background-image', 'url("' + url + '")');
	}

	function setCookie() {
	  document.cookie = 'lastSearch=' + $('#location-input').val() + ';';
	}

	function lastSearch() {
	  return document.cookie.match(/(?<=lastSearch=)\w+/);
	}

	function loadPreviousSearch() {
	  var match = lastSearch();
	  if (match != null) {
	    loadpage(match[0]);
	  }
	}

	$(document).ready(function () {
	  $('body').prepend((0, _navHtml.navHtml)());
	  loadBackground('sky.jpeg');
	  loadPreviousSearch();
	  if (document.cookie.match(/(?<=apiKey=)\w+/)) {
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
	      $("#register-dialogue").append((0, _registrationHtml.registrationHtml)());
	    }
	    $("#register-dialogue").slideDown(700);
	    $("#register-dialogue").find('.submit-button').click(function () {
	      registerUser($('#registration-email').val(), $('#registration-password').val(), $('#registration-password-confirmation').val());
	    });
	    $('.fa-window-close').mouseup(function () {
	      $("#register-dialogue").fadeOut(1000);
	    });
	  });
	}

	function loginListener() {
	  $('#login-button').mouseup(function () {
	    if ($("#login-dialogue").is(':empty')) {
	      $("#login-dialogue").append((0, _loginHtml.loginHtml)());
	    }
	    $("#login-dialogue").slideDown(700);
	    $("#login-dialogue").find('.submit-button').click(function () {
	      loginUser($('#login-email').val(), $('#login-password').val());
	    });
	    $('.fa-window-close').click(function () {
	      $("#login-dialogue").fadeOut(1000);
	    });
	  });
	}

	function loginUser(email, password) {
	  fetch(backendAddress + '/api/v1/sessions?email=' + email + '&password=' + password, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    handleLoginResponse(myJson);
	  }).catch(function (errors) {
	    renderFlash("Unrecognized username or password", "red");
	  });
	}

	function registerUser(email, password, passwordConfirmation) {
	  fetch(backendAddress + '/api/v1/users?email=' + email + '&password=' + password + '&password_confirmation=' + passwordConfirmation, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    handleRegisterResponse(myJson);
	  });
	}

	function handleRegisterResponse(response) {
	  var apiKey = response["api_key"];
	  if (apiKey === undefined) {
	    renderFlash('Registration Failed.');
	  } else {
	    renderFlash('Registration Success!');
	    document.cookie = 'apiKey=' + apiKey;
	  }
	  $('#register-button').hide();
	  $('#login-button').hide();
	  showLogout();
	  $('#register-dialogue').slideUp(1000);
	}

	function handleLoginResponse(response) {
	  var apiKey = response["api_key"];
	  if (apiKey === undefined) {
	    renderFlash('Login Failed.');
	  } else {
	    renderFlash('You are now logged in!');
	    document.cookie = 'apiKey=' + apiKey;
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
	  $('#logout-button').mouseup(function () {
	    document.cookie = "apiKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	    $('#register-button').show();
	    $('#login-button').show();
	    $('#logout-button').hide();
	    renderFlash('You have logged out');
	  });
	}

	function renderFlash(message) {
	  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "lightgreen";

	  $('#flash').html(message);
	  var width = $('#flash').width();
	  $('#flash').css('margin-left', width * -0.5);
	  $('#flash').css("background-color", color);
	  $('#flash').fadeIn('fast');
	  setTimeout(function () {
	    $('#flash').fadeOut(7000);
	  }, 10000);
	}

	function apiKey() {
	  var match = document.cookie.match(/(?<=apiKey=)[\w\.-]+/);
	  if (match) {
	    return match[0];
	  }
	}

	function loadFavorites() {
	  if (apiKey() === undefined) return null;
	  fetch(backendAddress + '/api/v1/favorites?api_key=' + apiKey(), {
	    method: 'get',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    renderFavorites(myJson);
	    addFavoriteDeleteListener();
	  });
	}

	function addFavoriteDeleteListener() {
	  $(".favorite-close").mouseup(function () {
	    $(this).css('font-weight', "normal");
	    deleteFavorite($(this).parent().attr('data'));
	    $(this).parent().fadeOut(5000);
	  });
	}

	function deleteFavorite(city_id) {
	  if (apiKey() === undefined) return null;
	  fetch(backendAddress + '/api/v1/favorites?api_key=' + apiKey() + '&city_id=' + city_id, {
	    method: 'delete',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    }
	  }).then(function (response) {
	    return response.json();
	  }).then(function (myJson) {
	    if (myJson.name) {
	      renderFlash(myJson.name + ' has been removed from your favorites.');
	      if (myJson.id.toString() === $('#current-weather').attr('data')) {
	        starSetup();
	      }
	    } else {
	      renderFlash('Server error.', 'red');
	    }
	  });
	}

	function renderFavorites(weather) {
	  $('#favorites-container').empty();
	  $('#favorites-container').append('<h2>Your Favorites</h2>');
	  $('#favorites-container').append('<div id="favorites"></div>');

	  var ids = [];
	  weather.forEach(function (city_weather) {
	    $('#favorites').append((0, _favoriteHtml.favoriteHtml)(city_weather));
	    ids.push(city_weather.id);
	  });

	  if (ids.includes(parseInt($('#current-weather').attr('data')))) {
	    $('.fa-star').off('click');
	    $('.fa-star').css('font-weight', 'bold');
	  }
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  background-color: grey;\n  font-family: sans-serif;\n  background-size: cover;\n  font-weight: 100; }\n\n.dark {\n  background: rgba(19, 25, 49, 0.6);\n  color: white; }\n\n.dialogue-box {\n  background-color: white;\n  margin: 5px;\n  padding: 30px;\n  max-width: 300px;\n  position: absolute;\n  left: 50%;\n  top: 20%;\n  box-shadow: 0px 0px 15px 2px #111;\n  display: none; }\n\n.card {\n  border-radius: 5px;\n  margin: 15px;\n  padding: 15px; }\n\n.scrollable {\n  overflow: scroll; }\n\n.temp-low {\n  color: #E0F1F0; }\n\n.fa-window-close {\n  position: absolute;\n  top: 8px;\n  right: 8px; }\n  .fa-window-close:hover {\n    color: red; }\n  .fa-window-close:active {\n    font-weight: bold; }\n\n.favorite-close {\n  position: relative;\n  top: -5px;\n  left: 106px;\n  font-weight: bold; }\n\n.fa-star {\n  margin-left: 5px;\n  color: gold; }\n\n.white-icon {\n  fill: white; }\n\n.hour-icon {\n  margin: -30px; }\n\n.forecast-hour-data {\n  min-width: 70px; }\n\n#icon-and-summary {\n  padding-bottom: 15px; }\n\n#current-weather-icon {\n  margin: -25px -20px -45px -25px; }\n\n#flash {\n  display: none;\n  position: fixed;\n  margin: 10px;\n  padding: 15px;\n  left: 50%;\n  text-align: center;\n  border-radius: 2px;\n  box-shadow: 0px 0px 15px 2px #111; }\n\n#forecast-hours {\n  overflow: scroll; }\n\n#current-temperature {\n  font-size: 72px;\n  display: inline; }\n\n#logout-button {\n  display: none; }\n\n#main-flex {\n  display: flex;\n  flex-wrap: wrap; }\n\n#weather-details {\n  width: 124px; }\n\n#current-weather {\n  color: white; }\n\n#forecast {\n  width: 400px;\n  background: rgba(49, 10, 19, 0.6); }\n\n#favorites {\n  display: flex;\n  flex-wrap: wrap; }\n\n.favorite-city {\n  border-color: rgba(100, 100, 100, 0.5);\n  border-width: 10px;\n  border-style: outset;\n  padding: 12px;\n  margin: 10px; }\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	var registrationHtml = exports.registrationHtml = function registrationHtml() {
	   return "<nav>\n    <i class=\"far fa-window-close\"></i>\n    <h3>Register</h3>\n    <p><input id=\"registration-email\" type=\"email\" placeholder=\"email\"></p>\n    <p><input id=\"registration-password\" type=\"password\" placeholder=\"password\"></p>\n    <p><input id=\"registration-password-confirmation\" type=\"password\" placeholder=\"password\"></p>\n    <button class=\"submit-button\">Submit</button>\n  </nav>";
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.favoriteHtml = favoriteHtml;
	function favoriteHtml(city) {
	   return "<div id=\"favorite-city-" + city.id + "\" class=\"favorite-city\" data=\"" + city.id + "\">\n       <i class=\"far fa-star favorite-close\"></i>\n       <h3> <span id=\"city-name\">" + city.name + "</span>, <span id='state-name'></span></h3>\n       <h4 id=\"country-name\">" + city.country + "</h4>\n       <p id=\"current-summary\">" + city.current_weather.summary + "</p>\n       <p> <span id=\"current-temperature\">" + city.current_weather.temperature + "</span></p>\n\n       <p> <span id=\"feels-like\">Feels Like: " + city.current_weather.feels_like + "</span></p>\n       <p> <span id=\"humidity\">Humidity: " + city.current_weather.humidity + "</span></p>\n       <p> <span id=\"visibility\">Visibility: " + city.current_weather.visibility + "</span></p>\n       <p> <span id=\"uv-index\">UV Index: " + city.current_weather.uv_index + "</span></p>\n     </div>";
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	var loginHtml = exports.loginHtml = function loginHtml() {
	   return "<nav>\n    <i class=\"far fa-window-close\"></i>\n    <h3>Log in</h3>\n    <p><input id=\"login-email\" type=\"email\" placeholder=\"email\"></p>\n    <p><input id=\"login-password\" type=\"password\" placeholder=\"password\"></p>\n    <button class=\"submit-button\">Submit</button>\n  </nav>";
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var navHtml = exports.navHtml = function navHtml() {
	    return "<input id=\"location-input\" type=\"text\">\n    <button id=\"search-button\" class=\"default-button\">Find Weather</button>\n    <button id=\"register-button\">Register</button>\n    <button id=\"login-button\">Login</button>\n    <button id=\"logout-button\">Logout</button>";
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var iconPaths = exports.iconPaths = {
	  "clear-day": "assets/climacons/Sun.svg",
	  "clear-night": "assets/climacons/Moon.svg",
	  "partly-cloudy-day": "assets/climacons/Cloud-Sun.svg",
	  "partly-cloudy-night": "assets/climacons/Cloud-Moon.svg",
	  "cloudy": "assets/climacons/Cloud.svg",
	  "rain": "assets/climacons/Cloud-Drizzle.svg",
	  "sleet": "assets/climacons/Cloud-Rain.svg",
	  "snow": "assets/climacons/Cloud-Snow.svg",
	  "wind": "assets/climacons/Wind.svg",
	  "fog": "assets/climacons/Cloud-Fog.svg"

	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var forecastDayHtml = exports.forecastDayHtml = function forecastDayHtml(iconPath) {
	  return "\n  <td class=\"forecast-day-name\"></td>\n  <td class=\"forecast-day-precip-probability\"></td>\n  <td>\n    <i class=\"fas fa-long-arrow-alt-up\"></i>\n    <span class=\"forecast-day-high\"></span>\n  </td>\n  <td>\n    <img class=\"day-icon\" src=\"" + iconPath + "\">\n    </img>\n  </td>\n  <td class='temp-low'>\n    <i class=\"fas fa-long-arrow-alt-down\"></i>\n    <span class=\"forecast-day-low\"></span>\n  </td>\n  ";
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var forecastHourHtml = exports.forecastHourHtml = function forecastHourHtml(iconPath) {
	  return "\n  <p class=\"hour-time\">7 PM</p>\n    <img class=\"hour-icon\" src=\"" + iconPath + "\">\n    </img>\n  <p class=\"hour-temp\">70</p>\n";
	};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var currentWeatherHtml = exports.currentWeatherHtml = function currentWeatherHtml(iconPath) {
	  return "<div class=\"card\">\n  <h3> <span id=\"city-name\"></span>, <span id='state-name'></span><i class=\"far fa-star current-star\"></i></h3>\n  <h4 id=\"country-name\"></h4>\n  <p id=\"current-time\"></p>\n  <p id=\"icon-and-summary\">\n    <span>\n      <img id=\"current-weather-icon\" src=\"" + iconPath + "\">\n      </img>\n    </span>\n    <span id=\"current-summary\"></span>\n  </p>\n  <p>\n    <i class=\"fas fa-long-arrow-alt-up\"></i>\n    <span id=\"current-high\"></span>\n    <span class=\"temp-low\">\n      <i class=\"fas fa-long-arrow-alt-down\"></i>\n      <span id=\"current-low\"></span>\n    </span>\n    </p>\n  <p> <span id=\"current-temperature\"></span></p>\n</div>";
	};

/***/ })
/******/ ]);