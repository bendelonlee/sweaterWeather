// This file is in the entry point in your webpack config.
import './styles.scss';

const backendAddress = 'http://localhost:3000';

// $(document).ready(function() {


  fetch(`${backendAddress}/api/v1/forecast?location=Denver`, {
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
    console.log(JSON.stringify(myJson));
  });

  $('p').click(function () {
    $(this).hide();
  });

  console.log("I loaded");
// }
