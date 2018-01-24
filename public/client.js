
console.log('Client-side code running');
//windows not to be displayed on start up of game
$('#hide').hide();
$('#messages').hide();
$('#selectTeam').hide();
$('#gamewindow').hide();
$('#selectPlayers').hide();
$('#teamSelectView').hide();
$('#playersSel').hide();

/////global vars ///////
//holds all teams
let clubs = [];
//sets the users team
let userTeam;
//to hold the name of this users game
let gameName;
let user;
let week = 0;
let currentFixtures;
let myPlayers;
let playersLoaded = false;

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
  getDetails(){
    return `${this.squad_number}: ${this.first_name} ${this.second_name}`;
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


//consts for html elementes to be modified by js
const username        = document.getElementById('username');
const startBtn        = document.getElementById('startGame');
const quitBtn         = document.getElementById('endGame');
const modalBtn        = document.getElementById('modelBtn');
const messageBorad    = document.getElementById('messages');
const selectTeam      = document.getElementById('selectTeam');
const loadTable       = document.getElementById('loadTable');
const leagueTable     = document.getElementById('leagueTable');
const fixtureBtn      = document.getElementById('fixtureBtn');
const fixtureView     = document.getElementById('fixtureView');
const selectPlayers   = document.getElementById('selectPlayers');
const teamSelectView  = document.getElementById('teamSelectView');
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
//event listener for view table button
loadTable.addEventListener('click', function(e) {
  console.log("view table clicked");
  tableSort();
  $('#tableview').show();
  $('#fixtureView').hide();
  $('#teamSelectView').hide();
  $('#playersSel').hide();

});
//event listener for fixture button
fixtureBtn.addEventListener('click', function(e) {
  console.log("fixture button");
  $('#tableview').hide();
  $('#teamSelectView').hide();
  $('#teamSelectView').hide();
  $('#playersSel').hide();
  //gets the current weeks fixtures
  getFixtures();
});
//event listener for team selector button
selectPlayers.addEventListener('click', function(e) {
  console.log("selector button");
  $('#tableview').hide();
  $('#fixtureView').hide();
  $('#teamSelectView').show();
  $('#playersSel').show();
  loadPlayerSelection();

});


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
        userTeam = clubs[c];
        break;
    }
  }
  console.log(`team is ${t}`);
  //alert(`team is ${selectedTeam} `)
  document.getElementById('testModel').innerHTML = `You have selected ${selectedTeam}`;
  //userTeam = selectedTeam;
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
});


//gets the current weeks fitures from the server
function getFixtures(){

  let wait = true;

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
      displayFixtures(data);

    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });

}
//inserts the fixtures into html
function displayFixtures(data){
  console.log(`fixtues ${data}`);
  currentFixtures = data;
  let html = "";
  //loops through the fixtures and creates a table of fixture to the user
  data.forEach(function(element){
    let home;
    let away;
    //gets the clubs from the fixture and their image assets using the class methods
    clubs.forEach(function(clubElement){
      if (element[0] === clubElement.name){
        home = clubElement
      }
      if (element[1] === clubElement.name){
        away = clubElement
      }
    });

    html = html + `<div class = "fixtures">
      <table class ="single">
        <tr>
          <td> <img src='${home.getCrest()}' class="single img-responsive"></td>
          <td>${home.name} </td>
          <td class="v">V</td>
          <td>${away.name} </td>
          <td>  <img src='${away.getCrest()}' class=" single img-responsive"> </td>
        </tr>
      </table>
    </div>`;
  });

  fixtureView.innerHTML = html;
  $('#selectPlayers').show();
  $('#fixtureView').show();
}

//used to create the likely amount of goals a team is expected to score
function getExpectedGoals(compare){
  const minVal = -330;
  const minGoals = 0.32;
  const maxVal = 410;
  const maxGoals = 2.65;
  return minGoals + (maxGoals - minGoals)* (compare-minVal)/(maxVal-minVal);
}

//poisson Poisson distribution used to genertate goals
//http://en.wikipedia.org/wiki/Poisson_distribution
function goalGenerator(expectedGoals){
  let goals = 0;
	limit = Math.exp(-expectedGoals);
	x = Math.random();

    while(x > limit){
        goals ++;
        x *= Math.random();;
    }
    //returns
    return goals;
}

//sorts the teams it ord of position justing a bubble sort algroitim
function tableSort(){
  let table = clubs;
  //bubble sort
  for (let i = 0; i < table.length; i++){
    //loops 20 times first round and 1 less each time there after
    for (let x = 0; x < (table.length - i - 1); x++){
      // compares the points of 2 teasm and swaps if greater
      if (table[x].points < table[x+1].points){
        let swap = table[x];
        table[x] = table[x+1];
        table[x+1] = swap;
        //used to check gd when to teams have the same points
      }else if (table[x].points === table[x+1].points){
        //compare and sort by goal difference
        if ((table[x].scored -  table[x].conceeded) < (table[x+1].scored -  table[x+1].conceeded)){
          let swap = table[x];
          table[x] = table[x+1];
          table[x+1] = swap;
        }
      }
    }
  }
  console.log(clubs);
  createTable(clubs);
}

/* used to generate the html of the table*/
function createTable(orderedTeams){
  let pos = 0;
  //creats the table header
  let tableData =
    `<tr class = "head">
        <th>Pos</th>
        <th></th>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>GD</th>
        <th>PTS</th>
      </tr>`;
  //loops through all the teams
  orderedTeams.forEach(function(clubElement){
    //adds a class to te users team
    let classAdd = "notUser";
    if (clubElement.name === userTeam) {
      classAdd = 'userRow';
    }
    pos += 1;
    console.log(`${clubElement.scored} - ${clubElement.conceeded}`);
    //appends each row with the teams data
    tableData = tableData + `
      <tr class = "${classAdd}">
        <td>${pos}</td>
        <td class="dot">&#xb7;</td>
        <td>${clubElement.name}</td>
        <td>${clubElement.played}</td>
        <td>${clubElement.w}</td>
        <td>${clubElement.d}</td>
        <td>${clubElement.l}</td>
        <td>${clubElement.scored - clubElement.conceeded}</td>
        <td>${clubElement.points}</td>
      </tr>`;
    });
    //inserts into the html doc
    leagueTable.innerHTML = tableData;
}

//loads the players for user to select from the players arrya
function loadPlayerSelection(){
  //checks if the players are already loaded
  if(!playersLoaded){
    //gets and creats a draggabel image with a tooltip for each player
    userTeam.players.forEach(function(pl){
      pl.printName();
      $("#playersSel").append(`<img  src = "${pl.getImage()}" id="${pl.web_name}" data-toggle="tooltip" data-placement="bottom" title="${pl.squad_number}:${pl.web_name}" draggable="true" ondragstart="drag(event)">`);
    });
    playersLoaded = true;
  }
}

//allows drop behaviour
function allowDrop(ev) {
    ev.preventDefault();
}
//allows the players to be draged
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
//used to handle the drop player event
function drop(ev, pos) {
    //removes default behaviour
    ev.preventDefault();
    //prints childern
    console.log(`i have ${ev.target.childElementCount} childern`);
    //ensures only one player can be added
    if (ev.target.childElementCount < 1){
      //console.log(id);
      //gets the data
      var droppedPlayer = ev.dataTransfer.getData("text");
      console.log(`this is dropped ${droppedPlayer}`);
      //gets the postion of the selected player
      let playerPos;
      userTeam.players.forEach(function(p){
        //when the palyer is the draged player set postition
        if (droppedPlayer === p.web_name){
          playerPos = p.getPostion();
        }
      });
      //check the postion of the drop box
      //if its a goalkeeper
      if (pos === "goalkeeper"){
        //only allow a goalkeeper to play in goal
        if(playerPos === "goalkeeper"){
          //add the player to the dropable box
          ev.target.appendChild(document.getElementById(droppedPlayer));
          //if the user is trying to add a player thats not a goalkeeper display an error
          messageBorad.innerHTML = `${droppedPlayer} a ${playerPos} is your ${pos}`;
        }else{
          console.log("i want a goalkeeper");
          messageBorad.innerHTML = `Only a goalkeeper can play in goal`;
        }
      }else{
        if(playerPos !== "goalkeeper"){
          ev.target.appendChild(document.getElementById(droppedPlayer));
          messageBorad.innerHTML = `${droppedPlayer} a ${playerPos} is your ${pos}`;
        }else{
          console.log("i dont want a goalkeeper");
          messageBorad.innerHTML = `A goalkeeper can only play in goal`;

        }
      }
    }
    //if 11 players are selected sets user team values
    checkIfTeamSelected();
}//close drop player function

/*
when 11 players are seleted gets the players and resets teams ratings based on the selected players
*/
function checkIfTeamSelected(){
  const childern = document.getElementById("goalkeeper").childElementCount +
    document.getElementById("rightBack").childElementCount +
    document.getElementById("rightCenterHalf").childElementCount +
    document.getElementById("leftCenterHalf").childElementCount +
    document.getElementById("leftBack").childElementCount +
    document.getElementById("rightMid").childElementCount +
    document.getElementById("rightCenterMid").childElementCount +
    document.getElementById("leftCenterMid").childElementCount +
    document.getElementById("leftMid").childElementCount +
    document.getElementById("rightStk").childElementCount +
    document.getElementById("leftStk" ).childElementCount;
    console.log(`there are ${childern} players selected`);

    if(childern === 11){
      console.log('setplayers');
      //get the values for the seleted team
      const gk  = getPlayer(document.getElementById("goalkeeper").childNodes[0].id);
      const rb  = getPlayer(document.getElementById("rightBack").childNodes[0].id);
      const cb1 = getPlayer(document.getElementById("rightCenterHalf").childNodes[0].id);
      const cb2 = getPlayer(document.getElementById("leftCenterHalf").childNodes[0].id);
      const lb  = getPlayer(document.getElementById("leftBack").childNodes[0].id);
      const rm  = getPlayer(document.getElementById("rightMid").childNodes[0].id);
      const cm1 = getPlayer(document.getElementById("rightCenterMid").childNodes[0].id);
      const cm2 = getPlayer(document.getElementById("leftCenterMid").childNodes[0].id);
      const lm  = getPlayer(document.getElementById("leftMid").childNodes[0].id);
      const st1 = getPlayer(document.getElementById("rightStk").childNodes[0].id);
      const st2 = getPlayer(document.getElementById("leftStk").childNodes[0].id);
      //set def and attack
      const def = 850 + parseInt(gk) + parseInt(rb) + parseInt(cb1) + parseInt(cb2) + parseInt(lb) + parseInt(cm1) + parseInt(cm2);
      const att = 750 + parseInt(rm) + parseInt(st1) + parseInt(st2) + parseInt(lm) + parseInt(cm1) + parseInt(cm2);
      //modifies the users team to feflect the secled players
      userTeam.attackHome = att + 50;
      userTeam.attackAway = att;
      userTeam.defHome = def + 50;
      userTeam.defAway = def;
      console.log(`attack is ${att} defence is ${def}`);
      selectPlayers.disabled = true;

      $('#selectPlayers').hide();
      playCurrentFixtures();
      //remove players from pitch
      document.getElementById("goalkeeper").removeChild(document.getElementById("goalkeeper").childNodes[0]);
      document.getElementById("rightBack").removeChild(document.getElementById("rightBack").childNodes[0]);
      document.getElementById("rightCenterHalf").removeChild(document.getElementById("rightCenterHalf").childNodes[0]);
      document.getElementById("leftCenterHalf").removeChild(document.getElementById("leftCenterHalf").childNodes[0]);
      document.getElementById("leftBack").removeChild(document.getElementById("leftBack").childNodes[0]);
      document.getElementById("rightMid").removeChild(document.getElementById("rightMid").childNodes[0]);
      document.getElementById("rightCenterMid").removeChild(document.getElementById("rightCenterMid").childNodes[0]);
      document.getElementById("leftCenterMid").removeChild(document.getElementById("leftCenterMid").childNodes[0]);
      document.getElementById("leftMid").removeChild(document.getElementById("leftMid").childNodes[0]);
      document.getElementById("rightStk").removeChild(document.getElementById("rightStk").childNodes[0]);
      document.getElementById("leftStk").removeChild(document.getElementById("leftStk").childNodes[0]);
    }
}
/* This function loops through all the current fixtures and generates the results for
each fixture*/
function playCurrentFixtures(){
  //disable buttons
  fixtureBtn.disabled = true;
  loadTable.disabled = true;
  //local varibles
  let homeTeam;
  let awayTeam;
  let html = ""
  //hide unused divs
  $('#teamSelectView').hide();
  $('#playersSel').hide();
  //loops through each fixture
  for (fix in currentFixtures){
      //fids the club for each fixture
      clubs.forEach(function(clubElement){
        //gets the home team
        if(clubElement.name === currentFixtures[fix][0] ){
          homeTeam = clubElement;
        }
        //gets the away tema
        if(clubElement.name === currentFixtures[fix][1]){
          awayTeam = clubElement;
        }
        //when the last club is hit generate results
        if (clubElement.name === "West Ham"){
          //gets the goals for each team
          let homeGoals = goalGenerator(getExpectedGoals(Math.max(homeTeam.attackHome - awayTeam.defAway,-330)));
          let awayGoals = goalGenerator(getExpectedGoals(Math.max(awayTeam.attackAway - homeTeam.defHome,-330)));
          //modifies the teams scored and conceded goals
          homeTeam.scored     = homeTeam.scored + homeGoals;
          awayTeam.conceeded  = awayTeam.conceeded + homeGoals;
          awayTeam.scored     = awayTeam.scored + awayGoals;
          homeTeam.conceeded  = homeTeam.conceeded +awayGoals;
          //increments the amount of matches the team has played
          awayTeam.played     = awayTeam.played +1;
          homeTeam.played     = homeTeam.played +1;
          //modifys the points of each team
          if (homeGoals === awayGoals){
            //this is a draw so points and drawn matches modifed
            awayTeam.points = awayTeam.points + 1;
            homeTeam.points = homeTeam.points + 1;
            awayTeam.d = awayTeam.d + 1;
            homeTeam.d = homeTeam.d + 1;
          }else if (homeGoals > awayGoals){
            //this is a home win so home points, w and away l modified
            homeTeam.points = homeTeam.points + 3;
            awayTeam.l = awayTeam.l + 1;
            homeTeam.w = homeTeam.w + 1;
          }else if (homeGoals < awayGoals){
            //this is an away win so away points, w and home l modified
            awayTeam.points = awayTeam.points + 3;
            awayTeam.w = awayTeam.w + 1;
            homeTeam.l = homeTeam.l + 1;
          }
          //display each result
          html = html + `<div class = "fixtures">
            <table class ="single">
              <tr>
                <td> <img src='${homeTeam.getCrest()}' class="single img-responsive"></td>
                <td>${homeTeam.name} </td>
                <td class="v">${homeGoals} - ${awayGoals}</td>
                <td>${awayTeam.name} </td>
                <td>  <img src='${awayTeam.getCrest()}' class=" single img-responsive"> </td>
              </tr>
            </table>
          </div>`;

          $('#fixtureView').show();
          fixtureView.innerHTML = html;

          //log results
          console.log(`${homeTeam.name} ${homeGoals} - ${awayTeam.name} ${awayGoals}`);
        }
      });
    }
    //moves to the next week
    week = week + 1;
    messageBorad.innerHTML = `Week ${week} results are now in`;
    //clears currentfitures array
    currentFixtures = {};
    //allows players to load again for the user to select
    playersLoaded = false;
    document.getElementById('playersSel').innerHTML = "";
    updateResults();
}


//gets the current weeks fitures from the server
function updateResults(){
  //send a server post request to end with the gameName and the current week to get the relevent fitures
  fetch('/results', {method: 'POST',
    body: JSON.stringify({game: gameName, week : week, teamData : clubs}),
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
      //reenable buttons
      selectPlayers.disabled = false;
      fixtureBtn.disabled = false;
      loadTable.disabled = false;
    })
    //catches errors
    .catch(function(error) {
      console.log(error);
    });

}

//returns a rating of a selected player
function getPlayer(playerName){
  for (p in userTeam.players){
    if(userTeam.players[p].web_name === playerName)
    return userTeam.players[p].ict_index;
  }
}

//bootstrap tooltip for each player
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
