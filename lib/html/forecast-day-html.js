export const forecastDayHtml = (iconPath) => `
  <td class="forecast-day-name"></td>
  <td>
    <img class="day-icon" src="${iconPath}">
    </img>
  </td>
  <td class="forecast-day-precip-probability"></td>
  <td class='temp-high'>
    <i class="fas fa-long-arrow-alt-up"></i>
    <span class="forecast-day-high"></span>
  </td>

  <td class='temp-low'>
    <i class="fas fa-long-arrow-alt-down"></i>
    <span class="forecast-day-low"></span>
  </td>
  `
