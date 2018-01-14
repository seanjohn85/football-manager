const gameJSON = require('./JSON/football.json');
//adds roundrobin module
const robin = require('roundrobin');
//adds shuffle array modele
const shuffle = require('shuffle-array');

const bodyparser = require('body-parser');
//console.log(parsedJSON);
let gameData = {};
let teams = [];
gameData.teams = [];
for (i in gameJSON.teams){
  let team = [gameJSON.teams[i]];
  team.points = 0;
  team.w = 0;
  team.l
  teams.push(gameJSON.teams[i].name);
  let players = [];
  //gameData.team = [gameJSON.teams[i]];
  for (y in gameJSON.players){
    if (gameJSON.players[y].team_code == gameJSON.teams[i].code){
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
      team.push(gameJSON.players[y]);
      console.log(gameJSON.teams[i].code);
    }
  }
  gameData.teams.push(team);
  console.log("here")
}



//this function is used to genertate fixures using round robin for a new game
function fixtureGenerator(){

  //creates round robin fixtures in both normal and reverse order
  let fix = robin(20, teams);
  let fix2 = robin(20, teams.reverse());
  //empty fixtures array to house the fixtures from presvious 2 arrays
  let fixtuers = [];
  //loops through all the fixtures adding them to the array
  for (let i in fix2){
    fixtuers.push(fix2[i]);
    fixtuers.push(fix[i]);
  }

  return shuffle(fixtuers);
}


//console.log(gameData);

let gameCounter = 0;

console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url =  "mongodb://localhost:27017/data";
MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
console.log('Data received: ' + req.body.username);

  gameCounter ++;
  const click = {clickTime: new Date()};
  let newGame = {};
  newGame.user = {username : req.body.username, gamename: req.body.username + gameCounter,
                  date : new Date(), gameNo : gameCounter};
  newGame.fixtuers = [];
  newGame.fixtuers.push(fixtureGenerator());
  newGame.teamData = [];
  newGame.teamData.push(gameData);
  console.log(click);
  console.log(db);

  db.collection('testGames').save(newGame, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('new Game Created');
    res.redirect('/');
  });
});
// get the click data from the database
app.get('/clicks', (req, res) => {

  db.collection('testGames').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});
