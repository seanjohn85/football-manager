
console.log('Client-side code running');
//to hold the name of this users game
let gameName;
//consts for html elementes
const username = document.getElementById('username');
const startBtn = document.getElementById('startGame');
const quitBtn = document.getElementById('endGame');
//sartgame button click handle event
startBtn.addEventListener('click', function(e) {
  //console.log(username.value);
  // sends a post method to start a game with the username from the input box
  fetch('/start', {method: 'POST',
    body: JSON.stringify({username: username.value}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  //handles server response
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    //sets the game name from the json response
    .then(function(data) {
       console.log("data recieved");
       console.log(data.game);
       gameName = data.game;
      // x = data;
      // console.log(x);
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });
    startBtn.disabled = true;

});

quitBtn.addEventListener('click', function(e) {
  //console.log(x);
  fetch('/end', {method: 'POST',
    body: JSON.stringify({game: gameName}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {

     return response.json();
   })

    //sets the game name from the json response
    .then(function(data) {
      console.log("here");
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });
    startBtn.disabled = false;
});

//checks the server at interval points
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
