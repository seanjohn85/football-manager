console.log('Client-side code running');

const username = document.getElementById('username');
const button = document.getElementById('startGame');
button.addEventListener('click', function(e) {
  console.log(username.value);
  fetch('/clicked', {method: 'POST', 
    body: JSON.stringify({x: "john"}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
} })
    .then(function(response) {
      if(response.ok) {
        console.log('click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
    button.disabled = true;
});

setInterval(function() {
  fetch('/clicks', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('counter').innerHTML = `Button was clicked ${data.length} times`;
    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);
