var express = require('express');
var http = require('http'),
  session = require('express-session'),
  auth = require('./app/auth');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');
var multer = require('multer');
var app = express();
var genuuid = require('./app/genuuid');
require('dotenv').config();


var server = http.createServer(app);

app.use(morgan('combined'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//app.use(multer({dest: './uploads'}));

app.use(session({
  genid: function (req) {
		  return genuuid() // use UUIDs for session IDs
  },
  resave: true,
  saveUninitialized: true,
  secret: "won't tell because it's secret"
}));
app.use(auth.initialize());
app.use(auth.session());
app.use(express.static(__dirname + '/public'));

// ROUTES ===========================
require('./app/routes')(app);

app.listen(process.env.PORT || 3000);
console.log('Live at http://localhost:3000');