//imports json of players and teams
const gameJSON = require('./JSON/football.json');
//adds roundrobin module
const robin = require('roundrobin');
//adds shuffle array modele
const shuffle = require('shuffle-array');
//model to pharse json requests
const bodyparser = require('body-parser');
//console.log(parsedJSON);
let teamData = {};
let teams = [];


//loops through the json file and creates array of teams and
for (i in gameJSON.teams) {
  gameJSON.teams[i].goals_conceded = 0;
  gameJSON.teams[i].goals_scored = 0;
  gameJSON.teams[i].played = 0;
  gameJSON.teams[i].points = 0;
  gameJSON.teams[i].won = 0;
  gameJSON.teams[i].lost = 0;
  gameJSON.teams[i].draw = 0;
  //creates array of teams for fixture gen to create fixures
  teams.push(gameJSON.teams[i].name);
  //array to hold players of a team
  let players = [];
  //gameData.team = [gameJSON.teams[i]];
  for (y in gameJSON.players) {
    if (gameJSON.players[y].team_code == gameJSON.teams[i].code) {
      gameJSON.players[y].goals_scored = 0;
      gameJSON.players[y].assists = 0;
      gameJSON.players[y].clean_sheets = 0;
      gameJSON.players[y].goals_conceded = 0;
      gameJSON.players[y].own_goals = 0;
      gameJSON.players[y].penalties_saved = 0;
      gameJSON.players[y].penalties_missed = 0;
      gameJSON.players[y].yellow_cards = 0;
      gameJSON.players[y].red_cards = 0;
      gameJSON.players[y].saves = 0;
      //insures player has an impact on the game, 0 is no impact
      if (gameJSON.players[y].ict_index < 30.0) {
        gameJSON.players[y].ict_index = 30.1;

      }
      //adds player to players array
      players.push(gameJSON.players[y]);
      //console.log(gameJSON.teams[i].code);
    }
  }
  gameJSON.teams[i].players = players;
  //adds team to the teamData array
  teamData[gameJSON.teams[i].name] = gameJSON.teams[i];
  //console.log("here")
}

//this function is used to genertate fixures using round robin for a new game
function fixtureGenerator() {
  //creates round robin fixtures in both normal and reverse order
  let fix = robin(20, teams);
  let fix2 = robin(20, teams.reverse());
  //empty fixtures array to house the fixtures from presvious 2 arrays
  let fixtuers = [];
  //loops through all the fixtures adding them to the array
  for (let i in fix2) {
    fixtuers.push(fix2[i]);
    fixtuers.push(fix[i]);
  }
  //reurns fixtures shuffled
  return shuffle(fixtuers);
}

//increments everytime a new game is created to enable unique game names
let gameCounter = 0;

console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

//increase the server app limit
app.use(bodyparser({
  limit: '50mb'
}));
// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());
//increase the server app limit
//app.use(express.bodyParser({limit: '50mb'}));

// connect to the db and start the express server
let db;

// URL for Mongo database
const url = "mongodb://localhost:27017/data";
//connects to the mongo db (db needs to be running)
MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/*
This fuction is triggered when a user creates a new games
the user game is sent to the server and a new game is created in the db
once the new game is created a response is send to the user with a list of teams
*/
app.post('/start', (req, res) => {
  console.log('Data received: ' + req.body.username);
  //increments the game counter
  gameCounter++;
  //create a new game object to add to the db
  let newGame = {
    teamData
  };
  //sets a unique game name
  newGame.game = req.body.username + gameCounter;
  //sets the palyers name
  newGame.user = req.body.username;
  //let to hold fixtures
  newGame.fixtures = fixtureGenerator();
  console.log(db);
  //save the newGame data to the database
  db.collection('singlePalyerGames').save(newGame, (err, result) => {
    if (err) {
      return console.log(err);
    }
    //array that will be used to house the response data
    let named = req.body.username + gameCounter;
    let data = {
      game: named
    };
    console.log('new Game Created');
    db.collection('singlePalyerGames').find({
      game: named
    }).toArray((err, teams) => {
      if (err) return console.log(err);
      data.teams = teams[0].teamData;
      console.log(teams[0].teamData);
      //sends the gamename and team data back to the user
      res.send(data);
    });
  });
});

/*
This fuction is triggered when a user reloads an old game
*/
app.post('/loadgame', (req, res) => {
  console.log('Data received: ' + req.body.gamename);
  let data = {
    game: req.body.gamename
  };
  //GET GAME DATA
  db.collection('singlePalyerGames').find({
    game: req.body.gamename
  }).toArray((err, teams) => {
    if (err) return console.log(`error working${err}`);
    console.log(`teams is ${teams}`);
    //used to stop server crashing if the gamename is invalid
    if (teams != ''){
      data.teams = teams[0].teamData;
      data.user = teams[0].user;
      data.game = teams[0].game;
      data.userTeam = teams[0].userTeam;
      //console.log(teams[0].teamData);
      console.log(teams[0].userTeam);
      //sends the gamename and team data back to the user
      res.send(data);
    }else{
      res.redirect(req.get('referer'));
    }

  });
});


//deletes the game from the db
app.post('/end', (req, res) => {
  //deletes a game by game name
  db.collection('singlePalyerGames').deleteOne({
    game: req.body.game
  }, (err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});

//updates the database with the team the user has selected
app.post('/selectedteam', (req, res) => {

  db.collection('singlePalyerGames').update({
    game: req.body.game
  }, {
    $addToSet: {
      userTeam: req.body.userTeam
    }
  }, (err, result) => {
    if (err) return console.log(err);
    //console.log(result);
    res.send(result);
  });
});

//user request to get the current weeks fixtures
app.post('/fixtures', (req, res) => {
  db.collection('singlePalyerGames').find({
    game: req.body.game
  }).toArray((err, fixtures) => {
    if (err) return console.log(err);
    //data.teams = teams[0].teamData;
    console.log(fixtures[0].fixtures[req.body.week]);
    //sends the gamename and team data back to the user
    res.send(fixtures[0].fixtures[req.body.week]);
  });
});

//user request to get the update the results of a set of fixtures
app.post('/results', (req, res) => {
  console.log("update results");
  //updates the users game with the new results
  db.collection('singlePalyerGames').update({
    game: req.body.game
  }, {
    $set: {
      teamData: req.body.teamData
    }
  }, (err, result) => {
    if (err) return console.log(err);
    //console.log(result);
    res.send(result);
  });
});
