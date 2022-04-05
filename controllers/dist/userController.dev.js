"use strict";

var express = require('express');

var app = express();

var User = require('../models/userModel');

var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

var path = require('path');

var fs = require('fs');

var uploadImg = require('../middlewares/imgUpload');

var passport = require('passport');

var jwt = require('jsonwebtoken');

require('../middlewares/passport');
/* --------------------- CHECK IF USER ALREADY EXISTS ----------------------- */


exports.checkUser = function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body);
          console.log(req.body.Username);
          User.findOne({
            username: req.body.Username
          }).then(function (data) {
            console.log(data);

            if (data != null) {
              console.log("Username Already Exists");
              res.send("Username Already Exists Please Try Again");
            } else {
              console.log("Username does not exists you can continue... ");
              console.log("Fetch request to LTO network and check if hash of the username exists in blockchain");
              console.log("If hash does not exists in blockchain then create new user in db");
              next();
              /*
              //Make a fetch request to the LTO network
              fetch('http://95.217.12.207:62627/hash/'+usersHash+'/encoding/base58')
              .then(response => response.json())
                  .then( (data) => {
                  //if the data exist in LTO, send a true response and exit
                  console.log('fetch request received that data exist in LTO, exiting');
                  res.send(true);
                  //if the data do not exist in LTO then search in DB
                  }).catch(err => {
                      console.log('fetch request received no data, insert CheckedUser into DB');
                      //Fetch request error handler
                      //if response is true then create the DB entry
                      //DB post request
                      User.create(checkUser).then(data => { 
                          console.log('The creation of the DB entry is succeed');
                          //DB create request 
                          res.send(false);
                      }).catch(err => {
                          console.log('An error occured during the creation of the DB entry');
                          res.send(true);
                      });
                  }).catch(err => {
                      //Error handling
                      console.log('error after');
                      res.status(500).send({
                          message:
                          err.message || "Some error occurred while retrieving the hash."
                      })
                  })   */
            }
          })["catch"](function (err) {
            //DB data search request error handler  
            res.status(500).send({
              message: err.message || "Some error occurred while retrieving data."
            });
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};
/* -------------------------------------------------------------------------- */

/* --------------------------- CREATE USER ---------------------------------- */


exports.imageUpload = function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          uploadImg.single('file');
          console.log(req.files);
          next();

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.createUser = function _callee3(req, res, next) {
  var password, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body); // validate request - check if username is not empty

          if (!req.body.username) {
            _context3.next = 4;
            break;
          }

          res.status(400).send({
            message: 'Content cannot be empty'
          });
          return _context3.abrupt("return");

        case 4:
          //console.log(await req.body.password)
          passwordForTesting = "test"; //create a user object with empty hasedID
          //let password = bcrypt.hashSync(req.body.password, 10) 

          password = bcrypt.hashSync(passwordForTesting, 10); //console.log(password)
          // get the User Model and saving to oure Request

          user = new User({
            //user_id:req.body.id,
            username: req.body.Username,
            email: req.body.Email,
            surname: req.body.Surname,
            name: req.body.Name,
            middleName: req.body.MiddleName,
            sexid: req.body.Sex,
            amka: req.body.Amka,
            photo: req.files.file.name,
            birth: req.body.Date_of_Birth,
            address: req.body.Address,
            phone: req.body.Phone_Number,
            emergencyPhone: req.body.Emergency_Contact_Phone_Number,
            doctorsPhone: req.body.Personal_Doctor_Phone_Number,
            medicalCondition: req.body.Life_Threatening_Medical_Condition,
            bloodType: req.body.Blood_Group,
            medication: req.body.Essential_Medications,
            allergies: req.body.Allergies,
            organDonor: req.body.Organ_Donor,
            password: password
          }); // save user in the database

          _context3.prev = 7;
          // check if mongoose is connected
          // the returned value 1 means connected, 0 means not connected and 2 means connecting.
          mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }, function () {
            return console.log(mongoose.connection.readyState);
          });
          _context3.next = 11;
          return regeneratorRuntime.awrap(user.save(function (err, result) {
            if (err) {
              console.log("Something went wrong during saving");
              console.log(err); //res.redirect('/');
            } else {
              console.log("User Added Successfully");
              console.log(result); // create/generate JWT for user

              var userPayload = {
                //id: toString(result._id),
                username: result.username,
                email: result.email
              };
              jwt.sign({
                userPayload: userPayload
              }, process.env.JWT_SECRET_KEY, function (err, token) {
                res.json({
                  token: token // send token to response header

                });
              }); //res.redirect('/index')
            }
          }));

        case 11:
          user = _context3.sent;
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](7);
          res.status(500).send({
            message: _context3.t0.message || 'Some error occured while creating the User'
          }); //res.render('/SignUP', {user : user})

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 14]]);
};
/* -------------------------------------------------------------------------- */

/* --------------------------- DELETE USER ---------------------------------- */


exports.deleteUser = function (req, res) {
  var id = req.params.id;
  User.destroy({
    where: {
      id: id
    }
  }).then(function (num) {
    if (num = 1) {
      res.send({
        message: 'User was deleted successfully!'
      });
    } else {
      res.send({
        message: "Cannot delete user with id=".concat(id, ". Maybe user was not found!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: 'Could not delete user with id=' + id
    });
  });
};
/* -------------------------------------------------------------------------- */

/* --------------------------- DELETE USER ---------------------------------- */


exports.findOneUser = function (req, res) {
  var id = req.params.id;
  User.findByPk(id).then(function (data) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Cannot find user with id=".concat(id)
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: 'Error retrieving User with id=' + id
    });
  });
};
/* -------------------------------------------------------------------------- */

/* -------------------------- DELETE ALL USERS ------------------------------ */


exports.deleteAll = function (req, res) {
  User.destroy({
    where: {},
    truncated: false
  }).then(function (nums) {
    res.send({
      message: "".concat(nums, " Users were deleted successfully!")
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occured while nuking."
    });
  });
};
/* -------------------------------------------------------------------------- */