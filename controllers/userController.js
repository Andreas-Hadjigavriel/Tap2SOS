const express           = require('express')
const app               = express()
const User              = require('../models/userModel')
const bcrypt            = require('bcrypt');
const mongoose          = require('mongoose')
const path              = require('path')
const fs                = require('fs');
const uploadImg         = require('../middlewares/imgUpload')
const passport          = require('passport')
const jwt               = require('jsonwebtoken')
require('../middlewares/passport')

/* --------------------- CHECK IF USER ALREADY EXISTS ----------------------- */
exports.checkUser = async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.Username)

  User.findOne({username: req.body.Username})
        .then( (data) => {
            console.log(data)

            if (data != null) {
                console.log("Username Already Exists")
                res.send("Username Already Exists Please Try Again")
            } else {
                console.log("Username does not exists you can continue... ")  
                console.log("Fetch request to LTO network and check if hash of the username exists in blockchain")
                console.log("If hash does not exists in blockchain then create new user in db") 
                next()
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
        }).catch( (err) => {   //DB data search request error handler  
            res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving data."
            });
        })
}
/* -------------------------------------------------------------------------- */

/* --------------------------- CREATE USER ---------------------------------- */

exports.imageUpload = async(req,res, next) => {
    uploadImg.single('file')
    console.log(req.files)

    next()
}
exports.createUser = async (req,res, next) => {

    console.log(req.body)

    // validate request - check if username is not empty
    if (req.body.username){
        res.status(400).send({
            message: 'Content cannot be empty'
        })
        return
    }

    //console.log(await req.body.password)
    passwordForTesting = "test"
    
    //create a user object with empty hasedID
    //let password = bcrypt.hashSync(req.body.password, 10) 

    let password = bcrypt.hashSync(passwordForTesting, 10) 

   //console.log(password)

    // get the User Model and saving to oure Request
    let user = new User({
        //user_id:req.body.id,
        username : req.body.Username,
        email : req.body.Email, 
        surname : req.body.Surname, 
        name : req.body.Name,
        middleName : req.body.MiddleName, 
        sexid : req.body.Sex,
        amka : req.body.Amka,
        photo: req.files.file.name,
        birth : req.body.Date_of_Birth,
        address : req.body.Address,
        phone : req.body.Phone_Number,
        emergencyPhone : req.body.Emergency_Contact_Phone_Number,
        doctorsPhone : req.body.Personal_Doctor_Phone_Number,
        medicalCondition : req.body.Life_Threatening_Medical_Condition,
        bloodType : req.body.Blood_Group,
        medication : req.body.Essential_Medications,
        allergies : req.body.Allergies,
        organDonor : req.body.Organ_Donor, 
        password : password 
    })

    // save user in the database
    try{
        // check if mongoose is connected
        // the returned value 1 means connected, 0 means not connected and 2 means connecting.
        mongoose.connect( process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log( mongoose.connection.readyState ) );

        user = await user.save(function(err,result){
            if(err){
                console.log("Something went wrong during saving")
                console.log(err)
                //res.redirect('/');
            } else {
                console.log("User Added Successfully")
                console.log(result)

                // create/generate JWT for user
                const userPayload = {
                    //id: toString(result._id),
                    username: result.username,
                    email: result.email
                }
                jwt.sign({userPayload}, process.env.JWT_SECRET_KEY, (err, token) => { 
                    res.json({
                        token   // send token to response header
                    })
                 })
                 //res.redirect('/index')
            }
        })
        
    } catch(err) {
        res.status(500).send({
            message: err.message || 'Some error occured while creating the User'
        })
        //res.render('/SignUP', {user : user})
    }
}

/* -------------------------------------------------------------------------- */

/* --------------------------- DELETE USER ---------------------------------- */
exports.deleteUser = (req,res) => {
    const id = req.params.id;
    User.destroy({
        where: {id : id}
    })
    .then( num => {
        if (num = 1) {
            res.send({
                message: 'User was deleted successfully!'
            })
        } else {
            res.send({
                message: `Cannot delete user with id=${id}. Maybe user was not found!`
            })
        }
    })
    .catch( (err) => {
        res.status(500).send({
            message: 'Could not delete user with id=' + id
        })
    })
}
/* -------------------------------------------------------------------------- */

/* --------------------------- DELETE USER ---------------------------------- */
exports.findOneUser = (req,res) => {
    const id = req.params.id
    User.findByPk(id)
    .then( (data) => {
        if (data) {
            res.send(data)
        } else {
            res.status(404).send({
                message: `Cannot find user with id=${id}`
            })
        }
    })
    .catch( (err) => {
        res.status(500).send({
            message: 'Error retrieving User with id=' + id
        })
    })
}
/* -------------------------------------------------------------------------- */

/* -------------------------- DELETE ALL USERS ------------------------------ */
exports.deleteAll = (req,res) => {
    User.destroy({
        where: {},
        truncated: false,
    })
    .then( (nums) => {
        res.send({message: `${nums} Users were deleted successfully!`})
    })
    .catch( (err) => {
        res.status(500).send({
            message: err.message || "Some error occured while nuking."
        })
    })
}
/* -------------------------------------------------------------------------- */
