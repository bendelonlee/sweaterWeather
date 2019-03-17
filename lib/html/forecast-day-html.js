export const forecastDayHtml = (iconPath) => `
  <td class="forecast-day-name"></td>
  <td class="forecast-day-precip-probability"></td>
  <td>
    <i class="fas fa-long-arrow-alt-up"></i>
    <span class="forecast-day-high"></span>
  </td>
  <td>
    <object class="day-icon" type="image/svg+xml" data="${iconPath}" src="${iconPath}">
    </object>
  </td>
  <td class='temp-low'>
    <i class="fas fa-long-arrow-alt-down"></i>
    <span class="forecast-day-low"></span>
  </td>
  `
