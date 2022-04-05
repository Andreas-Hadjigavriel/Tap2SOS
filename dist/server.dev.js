"use strict";

/* ------------------- Initializations -------------------- */
require('dotenv').config();

var express = require('express');

var mongoose = require('mongoose');

var auth = require('./middlewares/auth');

var authJwt = require('./helpers/jwt');

var errorHandler = require('./helpers/error_handlers');

var jwt = require("jsonwebtoken"); // for signing tokens


var methodOverride = require('method-override');

var path = require('path');

var bodyParser = require("body-parser");

var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

var cors = require('cors');

var session = require('express-session');

var passport = require('passport');

var passportJwt = require('passport-jwt'); // retrieving and verifying JWTs


var localStrategy = require('passport-local').Strategy; // for implementing local strategy


var bcrypt = require('bcrypt');

var app = express();

var User = require('./models/userModel');

var flash = require('connect-flash');

app.use('/SignUP', multipartMiddleware);
/* ----------------- Connect to db ----------------------- */

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("MongoDB Connected");
})["catch"](function (err) {
  return console.log(err);
}); // -------------------------------------------------------- //

app.set('view engine', 'ejs'); // Set view enigne 

app.set('views', path.join(__dirname, './views')); // Set view's path

app.use(express["static"]('./public')); //Set the path to static sources (css,js files)

app.use('public/uploads', express["static"]('uploads')); // Middlewares Use

var corsOptions = {
  origin: "http://localhost:2020/"
};
app.use(cors(corsOptions)); // cors provides Express middleware to enable CORS with various options.

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('_method')); //app.use(auth)
//app.use(authJwt)
//app.use(errorHandler)
// session token 

app.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize()); // passport init

app.use(passport.session()); // session use

require('./middlewares/passport');

app.use(flash()); // Routes Path

require('./routes/userRoutes')(app, passport); // Set the port of the server and run


var PORT = process.env.API_PORT || 8080;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});