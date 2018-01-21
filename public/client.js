
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
     points = 0, w = 0, l = 0, d  = 0, scored = 0, conceeded = 0, played = 0, players = [], userTeam = false) {
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
    this.played = played;
    this.players = players;
    this.userTeam = userTeam;
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
  //adds a player object to this classes players array
  addPlayer(player){
    player.printName();
    this.players.push(player);
  }
}//end of Team class


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
  //gets the image of the player
  getImage(){
    return `images/${this.team_code}/${this.code}.png`;
  }

  printName(){
    console.log(`my name is ${this.web_name}`);
  }
  //gets the players postion
  getPostion(){
    //checks the various postion codes and returns the position
    switch (this.position) {
      case 2:
        return 'defender';
        break;
      case 3:
        return 'midfielder';
        break;
      case 4:
        return 'striker';
        break;
      default:
        return 'invalid pos';
    }
  }
}//end of player class


//this is a goodkeeper class which inherates the player class
class GoalKeeper extends Player{
  //all the elements of the player with the additional clean_sheets element
  constructor(team_code, code, web_name, first_name, second_name, squad_number, assists,
   goals_scored, goals_conceded, own_goals, yellow_cards, red_cards, influence, creativity, threat,
   cost, ict_index, minutes, element_type, clean_sheets){
     //users the Player class constructor
    super(team_code, code, web_name, first_name, second_name, squad_number, assists,
     goals_scored, goals_conceded, own_goals, yellow_cards, red_cards, influence, creativity, threat,
     cost, ict_index, minutes, element_type);
     //sets the clean sheets
     this.clean_sheets = clean_sheets;
  }
  //overrides super class method
  getPostion(){
    return 'goalkeeper';
  }
  printName(){
    console.log(`my name is ${this.web_name} I AM A GoalKeeper`);
  }
}//end of goalkeeper class

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
        if (teams[t].players[player].element_type == 1){
          //creates a new player object for the current player
          const keeper = new GoalKeeper(teams[t].players[player].team_code, teams[t].players[player].code, teams[t].players[player].web_name,
            teams[t].players[player].first_name, teams[t].players[player].second_name, teams[t].players[player].squad_number,
            teams[t].players[player].assists, teams[t].players[player].goals_scored,
            teams[t].players[player].goals_conceded, teams[t].players[player].own_goals,
            teams[t].players[player].yellow_cards, teams[t].players[player].red_cards, teams[t].players[player].influence,
            teams[t].players[player].creativity, teams[t].players[player].threat, teams[t].players[player].cost,
            teams[t].players[player].ict_index, teams[t].players[player].minutes, teams[t].players[player].element_type, teams[t].players[player].clean_sheets)
            //adds te player to its team
            newTeam.addPlayer(keeper);
        }else{
          //creates a new player object for the current player
          const p = new Player(teams[t].players[player].team_code, teams[t].players[player].code, teams[t].players[player].web_name,
            teams[t].players[player].first_name, teams[t].players[player].second_name, teams[t].players[player].squad_number,
            teams[t].players[player].assists, teams[t].players[player].goals_scored,
            teams[t].players[player].goals_conceded, teams[t].players[player].own_goals,
            teams[t].players[player].yellow_cards, teams[t].players[player].red_cards, teams[t].players[player].influence,
            teams[t].players[player].creativity, teams[t].players[player].threat, teams[t].players[player].cost,
            teams[t].players[player].ict_index, teams[t].players[player].minutes, teams[t].players[player].element_type)
            //adds te player to its team
            newTeam.addPlayer(p);
        }

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
    $( ".selectTeam" ).append( `<div  class = 'selector col-lg-3 col-md-3'> <button  onclick="myTeamIs('${clubs[t].getName()}', '${clubs[t].getCrest()}', ' ${clubs[t]}')"  >
     <img src="${clubs[t].getCrest()}" class="img-responsive">
     <p> ${clubs[t].getName()} </p>
     </button></div>` );
  }
  $('#selectTeam').show();
}

function myTeamIs(selectedTeam, selectedCrest, ) {
  $("#teamModal").modal();
  console.log(selectedTeam);
  for (c in clubs){
    if (clubs[c].name == selectedTeam){

    }
  }
  console.log(`team is ${t}`);
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

    for (let i = 0; i < 38; i++){
      getFixtures();
      week += 1;
    }
    console.log(clubs);
});


//gets the current weeks fitures from the server
function getFixtures(){

  let wait = true;
  const sel = document.getElementById('pl');

  sel.addEventListener('click', function(e) {
    wait = false;
  });


  //send a server post request to end with the gameName and the current week to get the relevent fitures
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
      //console.log(data);
      let homeTeam;
      let awayTeam;
      for (fix in data){

        clubs.forEach(function(clubElement){

          if(clubElement.name === data[fix][0] ){
            homeTeam = clubElement;
            //homeTeam.points = 9;
          //  homeTeam.print();
          }
          if(clubElement.name === data[fix][1]){
            awayTeam = clubElement;
            //awayTeam.print();
          }
          if (clubElement.name === "West Ham"){
            let x = goalGenerator(getExpectedGoals(Math.max(homeTeam.attackHome - awayTeam.defAway,-330)));
            let y = goalGenerator(getExpectedGoals(Math.max(awayTeam.attackAway - homeTeam.defHome,-330)));

            awayTeam.played = awayTeam.played +1;
            homeTeam.played = homeTeam.played +1;
            if (x === y){
              awayTeam.points = awayTeam.points + 1;
              homeTeam.points = homeTeam.points + 1;
            }else if (x > y){
              homeTeam.points = homeTeam.points + 3;
            }else if (x < y){
              awayTeam.points = awayTeam.points + 3;
            }
            console.log(`${homeTeam.name} ${x} - ${awayTeam.name} ${y}`);
          }

        });
      }
      //console.log(clubs);
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });

}

//
function getExpectedGoals(compare){
  const minVal = -330;
  const minGoals = 0.3;
  const maxVal = 410;
  const maxGoals = 3;

  return minGoals + (maxGoals - minGoals)* (compare-minVal)/(maxVal-minVal);
}

//poisson thing
//http://en.wikipedia.org/wiki/Poisson_distribution
function goalGenerator(expectedGoals){
  var goals = 0;
	limit = Math.exp(-expectedGoals);
	x = Math.random();

    while(x > limit){
        goals ++;
        x *= Math.random();;
    }

return goals;
}
