
console.log('Client-side code running');


$('#hide').hide();
$('#messages').hide();
$('#selectTeam').hide();
const selectTeam = document.getElementById('selectTeam');



class Team{
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
  getCrest(){
    return `images/${this.code}/crest.png`;

  }
  getName(){
    return this.name;

  }

}

//holds all teams
let clubs = [];














//to hold the name of this users game
let gameName;

let user;
//consts for html elementes
const username = document.getElementById('username');

const startBtn = document.getElementById('startGame');
const quitBtn = document.getElementById('endGame');


const messageBorad = document.getElementById('messages');
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

      $('#startscreen').hide();
      $('#messages').show();
      messageBorad.getElementsByTagName("h1")[0].innerHTML = `Hello ${username.value}`;
      messageBorad.getElementsByTagName("p")[0].innerHTML = `Please Select your team`;
       console.log("data recieved");
       console.log(data.game);
       //console.log(data.teams);
       addTeams(data.teams)
       //console.log(data.teams);


       user = username.value;
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
    $( ".selectTeam" ).append( `<div  class = 'selector col-lg-3 col-md-3'> <button onclick="myTeamIs('${clubs[t].getName()}', '${clubs[t].getCrest()}')"  data-toggle="modal" data-target="#teamModal">
     <img src="${clubs[t].getCrest()}" class="img-responsive">
     <p> ${clubs[t].getName()} </p>
     </button></div>` );

  }
  $('#selectTeam').show();
}
function myTeamIs(selectedTeam, selectedCrest) {
  console.log(selectedTeam);
  //alert(`team is ${selectedTeam} `)
  document.getElementById('teamconfirm').innerHTML = `You have selected ${selectedTeam}`;
}
