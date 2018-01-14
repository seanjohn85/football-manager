
console.log('Client-side code running');
//to hold the name of this users game
let gameName;
//consts for html elementes
const username = document.getElementById('username');
const button = document.getElementById('startGame');

//sartgame button click handle event
button.addEventListener('click', function(e) {
  console.log(username.value);
  //
  fetch('/start', {method: 'POST',
    body: JSON.stringify({username: username.value}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      console.log(data);
      gameName = data;
      console.log(gameName);
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
      document.getElementById('counter').innerHTML = `There are  ${data.length} games created`;
    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);
