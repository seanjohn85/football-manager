const gameJSON = require('./JSON/football.json');
//adds roundrobin module
const robin = require('roundrobin');
//adds shuffle array modele
const shuffle = require('shuffle-array');

const bodyparser = require('body-parser');
//console.log(parsedJSON);
let gameData = {};
let teams = [];
let clubs = [];

gameData.teams = [];
for (i in gameJSON.teams){
  let team = [gameJSON.teams[i]];
   clubs.push(team);
  team.scored = 0;
  gameJSON.teams[i].goals_conceded = 0;
  team.played = 0;


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
      //console.log(gameJSON.teams[i].code);
    }
  }
  gameData.teams.push(team);
  //console.log("here")
}

///console.log(gameJSON.teams);

//console.log(clubs);

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

// URL for Mongo database
const url =  "mongodb://localhost:27017/data";
//connects to the mongo db (db needs to be running)
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

// serve the homepage from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// add a document to the DB collection recording the click event
app.post('/start', (req, res) => {
console.log('Data received: ' + req.body.username);



  //increments the game counter
  gameCounter ++;
  //create a new game object to add to the db
  let newGame = {};
  newGame.user = req.body.username + gameCounter;
  //newGame.user = {username : req.body.username, gamename: req.body.username + gameCounter,
            //      date : new Date(), gameNo : gameCounter};
  let fixt = fixtureGenerator();
  newGame.fixtures = [];
  for (i in fixt){
    console.log(fixt[i]);
    newGame.fixtures.push(fixt[i]);
  }
  newGame.teamData = [];
  newGame.teamData.push(gameData);
  console.log(db);

  db.collection('testGames').save(newGame, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('new Game Created');
    let x = {game: req.body.username + gameCounter};
    //sends the name of the game back to the user
    res.send(x);

  });
});
// get the click data from the database
app.post('/end', (req, res) => {

console.log('end');
/*for (i in gameJSON.teams){
  db.collection('teams').save(gameJSON.teams[i], (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
}*/

/*for (i in gameJSON.players){
  db.collection('players').save(gameJSON.players[i], (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
}*/

  // db.collection('testGames').deleteOne({user : req.body.game}, (err, result) => {
  //   if (err) return console.log(err);
  //   res.send(result);
  // });
});



// get the click data from the database
app.get('/clicks', (req, res) => {

  db.collection('testGames').find().toArray((err, result) => {
    if (err) return console.log(err);
    //console.log(result);
    res.send(result);
  });
});
