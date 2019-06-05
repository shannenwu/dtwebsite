const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');

// This file defines the passport strategies that authenticate the user.

passport.use(
  'login',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
    (username, password, done) => {
      try {
        User.findOne({
          email: username,
        }).then((user) => {
          if (user === null) {
            return done(null, false, {
              message: 'Unregistered email.',
            });
          }
          user.validPassword(password, (err, isMatch) => {
            if (!isMatch) {
              return done(null, false, {
                message: 'Incorrect password.'
              });
            } else {
              return done(null, user);
            }
          });
        });
      } catch (err) {
        done(err);
      }
    }),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  // console.log("deserialize")
  User.findById(id, function(err, user) {
    done(err, user);
  });
});