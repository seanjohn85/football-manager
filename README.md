# football-manager
# This EPL Football Manager game uses ES6, JSON, a node server app using Express and a Mongo DB database.

The game uses algorithms such as round robin and a random sort to generate different fixtures every time the game is played.
The game allows the user to select a premier league team and simulate one season as the selected team. 
The stats for the teams and players are real stats taken from fantasy football.
The user will impact the quality of their team based on their team selection.
A lamba fuction combined with a poisson Poisson distribution used to genertate goals
http://en.wikipedia.org/wiki/Poisson_distribution
The user uses a drad and drop feature to select their players.
The dataabse contains full CRUD functionality.
The leauge table is soted by points goals and alphabetically.



## Starting the server application (Mac based instructions)

If you haven't already install Node on your machine.
The following link provides details on how to set up Node on your local machine.
https://treehouse.github.io/installation-guides/mac/node-mac.html

If you haven't already install MogboDB on your machine.
The following link provides details on how to set up MongoDb on your local machine.
https://treehouse.github.io/installation-guides/mac/mongo-mac.html

Navigate to the project directory using the terminal.

Before starting the server the database needs to be started as the server needs to connect to the database.

To start the mogdoDB enter sudo mongod and enter your password (the sudo may not be needed depending on your mac set up)

Leave the mongo running and open a terminal window naviagetd to theproject directory.

Before started the server application please ensure to use NPM to download and install any library dependencies before starting the server application. This can be done using the NPM in the terminal.

The server app that needs to run is server.js. 

This can be run by simply typing node server into the terminal on the project directory.

The server will start and log Listening on *3000 to indicate the port no of the server app.

### Running on the client device

Once the server is running, open a web browser and type localhost:3000. This will connect to the Node server application and the server will serve the index.html web page. When the page loads you are good to go and the client and server setup is successful. Repeat this process to open multiple clients as the game needs more than one user.

If you navigate back to your terminal you will see a message indicating a new client has connected.


#### Using the application
1. log in
![alt tag](https://github.com/seanjohn85/football-manager/blob/master/start.png)

