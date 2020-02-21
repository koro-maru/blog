var express = require('express');
var router = express.Router();
var User = require('../models/user')
var bcrypt = require('bcryptjs');
const { check, body, validationResult } = require('express-validator');


//Retrieves all users
router.get('/', function(req, res, next) {
   User.find().then((result) => {
    return res.json(result);
   }).catch((err)=>{
      return next(err);
  })
});

//Shows the form to make a new user
router.get('/new', function(req, res, next){
  return res.json();
})

//Adds a new user to the db, then redirects
router.post('/', 
  [body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Your passwords do not match.');
      }
      else{
          return true;
      }
    }), 
    check('username').escape(),
    check('password').escape(),
    check('confirmPassword').escape(),
], function(req, res, next){
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    for(let i = 0; i < errors.array().length; i++){
      console.log(errors.array()[i].msg);
    }
    return res.sendStatus(422);
  }
  
  var user;
   bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
     if(err){
        return next(err)
      }
        user = new User({  
        email: req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        username: req.body.username,
        password: hashedPassword})

        user.save(err=>{
          if(err){
            return next(err);
          }
        })
  })
  return res.json(user);

})

//Shows info about a single user
router.get('/:id', function(req, res, next){
  User.findById(req.params.id).exec((err, result)=>{
    if(err){
      return next(err);
    }
    res.send(result);
  })
})

//Shows edit form of a single user
router.get('/:id/edit', function(req, res, next){
  User.findById(req.params.id)
  .exec((err, result) =>{
    if(err){
      return next(err)
    }
    res.send(result);
  })
})

//Edits, then redirects
router.put('/:id', function(req, res, next){
 
 bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
    if(err){
      return next(err)
    }
   var updatedUser = new User({ 
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      _id: req.params.id})
    
     User.findByIdAndUpdate(req.params.id, updatedUser).exec(function(err, result){
      if(err){
        return next(err);
      }
      console.log(result || "What")
     return res.json(result)
    });
   }) 
})

//Deletes user at id
router.delete('/:id', function(req, res, next){
  User.findByIdAndDelete(req.params.id, (err)=> {
    if(err){
      return next(err);
    }
  })
  res.send("Deleted.")
})


module.exports = router;
