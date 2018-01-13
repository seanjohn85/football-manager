let parsedJSON = require('./JSON/football.json');
//console.log(parsedJSON);
let x;
for (i in parsedJSON.teams){
  x = parsedJSON.teams[i];
}

console.log(x.name);
