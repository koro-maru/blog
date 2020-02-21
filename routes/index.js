var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user : user
            });
            //Session is false, as we are using a web token for auth instead
        } 
        req.login(user, {session: false}, (err) => {
           if (err) {
               return next(err);
           }           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
           return res.json({user, token});
        });
    })(req, res);
});

router.get('/protected', passport.authenticate('jwt', {session: false}), function(req, res){
  return res.send("Hey.")
})

router.get('/token', (req, res)=>{

})

/*The idea is, to store the minimum info that you can use without having to retrieve the user from the database in all the authenticated requests. */

router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
