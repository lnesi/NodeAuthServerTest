//Main starting point of the app

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // Parse incoming request into json no matter what request
const morgan = require('morgan'); //Log framework so we can see what happen on the request level on the server
const mongoose = require('mongoose'); 
const cors = require('cors');

//db setup
mongoose.connect('mongodb://localhost:auth/auth_test');

//Create instance of express to be our app
const app = express();

const router=require('./router');
// App Setup
// This are middleware in express
app.use(morgan('combined'));
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(bodyParser.json({type:'*/*'}));
router(app);




// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);

console.log('Server listening on:', port);