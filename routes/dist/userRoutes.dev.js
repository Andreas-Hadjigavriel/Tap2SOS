"use strict";

module.exports = function (app) {
  var userContr = require('../controllers/userController');

  var express = require('express');

  var _require = require('../middlewares/loginAuth'),
      isLoggedIn = _require.isLoggedIn,
      isLoggedOut = _require.isLoggedOut;

  var passport = require('passport');

  var jwt = require('jsonwebtoken');

  var verifyToken = require('../middlewares/auth');
  /* ------------------ Authentication Routes ---------------- */


  app.post('/SignUP', userContr.checkUser, userContr.imageUpload, userContr.createUser); // Login authentication

  app.post('/LogIN', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login?error=true'
  })); //app.get('/:id', userContr.findOneUser)
  //app.delete('/:id', userContr.deleteUser)

  /* -------------------- Render Pages ------------------------ */
  // main Page

  app.get('/', function (req, res) {
    res.render('pages/index');
  }); // Index Page -> before index page check if user is loggedIN unless go to LogIN page

  app.get('/index',
  /*(req,res) => {console.log(req.body)},*/
  //verifyToken, 
  passport.authenticate('jwt', {
    session: false
  }), function (req, res) {
    console.log(req.isAuthenticated());
    res.render('pages/index');
  }); // Sign up Page

  app.get('/SignUP', function (req, res) {
    res.render('pages/SignUP');
  }); // Login Page

  app.get('/LogIN', isLoggedOut, function (req, res) {
    res.render('pages/LogIN');
  }); // Logout

  app["delete"]("/logout", function (req, res) {
    req.logOut(); //logOut() clears the req.session.passport object and removes any attached params

    res.redirect("/login");
    console.log('User Logged out');
  });
};