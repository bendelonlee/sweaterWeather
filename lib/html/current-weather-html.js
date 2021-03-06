export const currentWeatherHtml = (iconPath) =>
`<div class="current-weather-card card">
  <h3> <span id="city-name"></span>, <span id='state-name'></span><i class="far fa-star current-star"></i></h3>
  <h4 id="country-name"></h4>
  <p id="current-time"></p>
  <p id="icon-and-summary">
    <span>
      <img id="current-weather-icon" src="${iconPath}">
      </img>
    </span>
    <span id="current-summary"></span>
  </p>
  <p>
    <span class="temp-high">
      <i class="fas fa-long-arrow-alt-up"></i>
    </span>
    <span id="current-high"></span>
    <span class="temp-low">
      <i class="fas fa-long-arrow-alt-down"></i>
      <span id="current-low"></span>
    </span>
    </p>
  <p> <span id="current-temperature"></span></p>
</div>`
