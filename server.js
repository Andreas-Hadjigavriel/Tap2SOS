/* ------------------- Initializations -------------------- */
require('dotenv').config()
const express               = require('express')
const mongoose              = require('mongoose')
const auth                  = require('./middlewares/auth')
const authJwt               = require('./helpers/jwt')
const errorHandler          = require('./helpers/error_handlers')
const jwt                   = require("jsonwebtoken") // for signing tokens
const methodOverride        = require('method-override')
const path                  = require('path')
const bodyParser            = require("body-parser")
var multipart               = require('connect-multiparty');
var multipartMiddleware     = multipart();
const cors                  = require('cors')
const session			          = require('express-session')
const passport			        = require('passport')
const passportJwt           = require('passport-jwt') // retrieving and verifying JWTs
const localStrategy		      = require('passport-local').Strategy // for implementing local strategy
const bcrypt			          = require('bcrypt')
const app                   = express()
const User                  = require('./models/userModel')
const flash                 = require('connect-flash');

app.use('/SignUP', multipartMiddleware);

/* ----------------- Connect to db ----------------------- */
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})  
.then(     () => console.log("MongoDB Connected") )
.catch( (err) => console.log(err) )
// -------------------------------------------------------- //

app.set('view engine', 'ejs')                   // Set view enigne 
app.set('views', path.join(__dirname,'./views')); // Set view's path
app.use(express.static('./public'))         //Set the path to static sources (css,js files)
app.use('public/uploads', express.static('uploads'));

// Middlewares Use
var corsOptions = {
  origin: "http://localhost:2020/"
};
app.use(cors(corsOptions))  // cors provides Express middleware to enable CORS with various options.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
//app.use(auth)
//app.use(authJwt)
//app.use(errorHandler)

// session token 
app.use(session({
	secret: process.env.ACCESS_TOKEN_SECRET, 
	saveUninitialized: false,
    resave: false,
}));
app.use(passport.initialize()); // passport init
app.use(passport.session());    // session use
require('./middlewares/passport')
app.use(flash());
// Routes Path
require('./routes/userRoutes')(app, passport)

// Set the port of the server and run
const PORT = process.env.API_PORT || 8080
app.listen(PORT, function () {
   console.log(`Server is running on port ${PORT}`);
})
