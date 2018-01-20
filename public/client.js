
console.log('Client-side code running');
//windows not to be displayed on start up of game
$('#hide').hide();
$('#messages').hide();
$('#selectTeam').hide();
$('#gamewindow').hide();

const selectTeam = document.getElementById('selectTeam');
let week = 0;


//class used to create Team objects
class Team{
  //used to set class instance varaibles
  constructor(code, name, attackHome, attackAway, defHome, defAway,
     points = 0, w = 0, l = 0, d  = 0, scored = 0, conceeded = 0, players = []) {
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
    this.players = players;
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
  addPlayer(player){
    player.printName();
    this.players.push(player);

  }
}
//class used to create player objects
class Player{
  //used to create player objects
  constructor(team_code, code, web_name, first_name, second_name, squad_number, assists,
   goals_scored, goals_conceded, own_goals, yellow_cards, red_cards, influence, creativity, threat,
   cost, ict_index, minutes, element_type){
    this.team_code = team_code;
    this.code = code;
    this.web_name = web_name;
    this.first_name = first_name;
    this.second_name = second_name;
    this.squad_number = squad_number;
    this.assists = assists;
    this.goals_scored = goals_scored;
    //this.clean_sheets = clean_sheets;
    this.goals_conceded = goals_conceded;
    this.own_goals = own_goals;
    this.yellow_cards = yellow_cards;
    this.red_cards = red_cards;
    this.influence = influence;
    this.creativity = creativity;
    this.threat = threat;
    this.cost = cost;
    this.ict_index = ict_index;
    this.minutes = minutes;
    this.position = element_type;
  }

  getImage(){
    return `images/${this.team_code}/${this.code}.png`;
  }

  printName(){
    console.log(`my name is ${this.web_name}`);
  }
  getPostion(){
    if (this.position == 2){
      return 'defender';
    } else if ( this.position == 2){
      return 'midfielder';
    }else{
      return 'striker';
    }
  }
}



class GoalKeeper extends Player{
  constructor(team_code, code, web_name, first_name, second_name, squad_number, assists,
   goals_scored, goals_conceded, own_goals, yellow_cards, red_cards, influence, creativity, threat,
   cost, ict_index, minutes, element_type){
    super(team_code, code, web_name, first_name, second_name, squad_number, assists,
     goals_scored, goals_conceded, own_goals, yellow_cards, red_cards, influence, creativity, threat,
     cost, ict_index, minutes, element_type, clean_sheets);
     this.clean_sheets = clean_sheets;
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
quitBtn.addEventListener('end', function(e) {
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
  console.log(teams);
  //loop through team data from db
  for (t in teams){

    //create a new team object
    let newTeam = new Team(teams[t].code, teams[t].name, teams[t].strength_attack_home,
      teams[t].strength_attack_away, teams[t].strength_defence_home, teams[t].strength_defence_away);
      //Gets the teams players
      for (player in teams[t].players){
        //creates a new player object for the current player
        let p = new Player(teams[t].players[player].team_code, teams[t].players[player].code, teams[t].players[player].web_name,
          teams[t].players[player].first_name, teams[t].players[player].second_name, teams[t].players[player].squad_number,
          teams[t].players[player].assists, teams[t].players[player].goals_scored,
          teams[t].players[player].goals_conceded, teams[t].players[player].own_goals,
          teams[t].players[player].yellow_cards, teams[t].players[player].red_cards, teams[t].players[player].influence,
          teams[t].players[player].creativity, teams[t].players[player].threat, teams[t].players[player].cost,
          teams[t].players[player].ict_index, teams[t].players[player].minutes, teams[t].players[player].element_type)
          //adds te player to its team
          newTeam.addPlayer(p);
      }
    //add the new team to teams array
    clubs.push(newTeam);
    //newTeam.print();
  }
  //loads the select team menu
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
  $('#gamewindow').show();
  gamewindow
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

    getFixtures();
});



function getFixtures(){

  //send a server post request to end with the gameName to be deleted in the request body
  fetch('/fixtures', {method: 'POST',
    body: JSON.stringify({game: gameName, week : week}),
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
      console.log(data);
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });

}
