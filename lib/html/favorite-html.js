export function favoriteHtml(city) {
    return `<div id="favorite-city-${city.id}">
       <h3> <span id="city-name">${city.name}</span>, <span id='state-name'></span></h3>
       <h4 id="country-name">${city.country}</h4>
       <p id="current-summary">${city.current_weather.summary}</p>
       <p> <span id="current-temperature">${city.current_weather.temperature}</span></p>

       <p> <span id="feels-like">Feels Like: ${city.current_weather.feels_like}</span></p>
       <p> <span id="humidity">Humidity: ${city.current_weather.humidity}</span></p>
       <p> <span id="visibility">Visibility: ${city.current_weather.visibility}</span></p>
       <p> <span id="uv-index">UV Index: ${city.current_weather.uv_index}</span></p>
     </div>`;
     }
