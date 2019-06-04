const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');

// This file defines the passport strategies that authenticate the user.

passport.use(
  'register',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, // what's this stuff
    session: false,
  },
  (req, username, password, done) => {
    console.log(req.body.email);
    try {
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
        User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hashedPassword,
          email: req.body.email,
        }).then((user) => {
          console.log('user created');
          return done(null, user);
        });
      });
    } catch (err) {
      return done(err);
    }
  }),
);

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
            message: 'this email has not been registered',
          });
        }
        user.validPassword(password, (err, isMatch) => {
          if (!isMatch) {
            console.log("why");
              return done(null, false, {
                  message: 'Incorrect password.'
              });
          } else {
              console.log("user authed");
              return done(null, user, {message: 'User authenticated!'});
          }
      });
      });
    } catch (err) {
      done(err);
    }
  },),
);

passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});