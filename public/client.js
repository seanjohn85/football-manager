
console.log('Client-side code running');
//windows not to be displayed on start up of game
$('#hide').hide();
$('#messages').hide();
$('#selectTeam').hide();
$('#gamewindow').hide();

const selectTeam = document.getElementById('selectTeam');


//class used to create Team objects
class Team{
  //used to set class instance varaibles
  constructor(code, name, attackHome, attackAway, defHome, defAway, points = 0, w = 0, l = 0, d  = 0, scored = 0, conceeded = 0){
    this.code = code;
    this.name = name;
    this.attackHome = attackHome;
    this.attackAway = attackAway;
    this.defHome = defHome;
    this.defAway = defAway;
    this.points = points;
    this.w = w;
    this.l = l;
    this.d = d;
    this.scored = scored;
    this.conceeded = conceeded;
  }

  print(){
    console.log(`code: ${this.code} name: ${this.name}`);
  }
  //gets the teams crest image from the images folder and team directory
  getCrest(){
    return `images/${this.code}/crest.png`;

  }
  //returns the name of the team
  getName(){
    return this.name;
  }
}

//holds all teams
let clubs = [];
//sets the users team
let userTeam;
//to hold the name of this users game
let gameName;

let user;
//consts for html elementes to be modified by js
const username = document.getElementById('username');
const startBtn = document.getElementById('startGame');
const quitBtn = document.getElementById('endGame');
const modalBtn = document.getElementById('modelBtn');
const messageBorad = document.getElementById('messages');

//sartgame button click handle event to send server reqeust to set up game
startBtn.addEventListener('click', function(e) {
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

      //changes to next screen
      $('#startscreen').hide();
      $('#messages').show();
      //modifies noticeboad content
      messageBorad.getElementsByTagName("h1")[0].innerHTML = `Hello ${username.value}`;
      messageBorad.getElementsByTagName("p")[0].innerHTML = `Please Select your team`;
       console.log(data.game);
       //console.log(data.teams);
       addTeams(data.teams)
       //console.log(data.teams);
       //sets global proberies
       user = username.value;
       gameName = data.game;
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });
    //prevents multiple server requests
    startBtn.disabled = true;
});
//used to delete the game from the db if a user quits

quitBtn.addEventListener('click', function(e) {
  //send a server post request to end with the gameName to be deleted in the request body
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
    //disables button to prevent multiple server requests
    startBtn.disabled = false;
});

//checks the server at interval points
/*setInterval(function() {
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
}, 1000);*/


//create all the team objects and add them to the teams array
function addTeams(teams){
  //loop through team data from db
  for (t in teams){
    //create a new team object
    let newTeam = new Team(teams[t].code, teams[t].name, teams[t].strength_attack_home,
      teams[t].strength_attack_away, teams[t].strength_defence_home, teams[t].strength_defence_away);
    //add the new team to teams array
    clubs.push(newTeam);
    newTeam.print();
  }
  selectTeamMenu();
}
//create the new teams menu
function selectTeamMenu(){
  console.log("here" + clubs.length);
  for (t in clubs){
    let te = clubs[t];
    console.log(clubs[t].getName());
    $( ".selectTeam" ).append( `<div  class = 'selector col-lg-3 col-md-3'> <button  onclick="myTeamIs('${clubs[t].getName()}', '${clubs[t].getCrest()}')"  >
     <img src="${clubs[t].getCrest()}" class="img-responsive">
     <p> ${clubs[t].getName()} </p>
     </button></div>` );
  }
  $('#selectTeam').show();
}

function myTeamIs(selectedTeam, selectedCrest) {
  $("#teamModal").modal();
  console.log(selectedTeam);
  //alert(`team is ${selectedTeam} `)
  document.getElementById('testModel').innerHTML = `You have selected ${selectedTeam}`;
  userTeam = selectedTeam;
  let img = `<img src="${selectedCrest}" class="img-responsive">`;
  document.getElementById('testModel2').innerHTML = img;
}

//when the user clicks to confirm their team this is triggered to notify the server and start the game
modalBtn.addEventListener('click', function(e) {
  //removes selection screen
  $('#selectTeam').hide();
  messageBorad.getElementsByTagName("p")[0].innerHTML = "UPDATING GAME DATA";
  console.log(userTeam);
  fetch('/selectedteam', {method: 'POST',
    body: JSON.stringify({game: gameName, userTeam, userTeam}),
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
});
