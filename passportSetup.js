const passport    = require('passport');
const passportJWT = require("passport-jwt");
const User = require("./models/user")
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
    
        bcrypt.compare(password, user.password, function(err, result){
            if(result){
               return done(null, user);
            }
            else{
                return done(null, false, { message: 'Password.' });
            }
        })
      });
    }
  ));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET
},
  function (payload, done) {
    console.log(payload)
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
     User.findById(payload.id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}
));
