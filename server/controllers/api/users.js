const express = require('express');
const { check, validationResult } = require('express-validator/check');
const jimp = require('jimp');
const path = require('path');

const User = require('../../models/User.js');

const ensure = require('../ensure');

const app = express.Router();
const publicPath = path.resolve(__dirname, '..', '..', '..', 'client', 'dist');

// This file handles paths to get/modify/delete/create user data. These routes are prefixed by /api/users/{ENDPOINT}

// Return all users in database
app.get('/',
  ensure.choreographer,
  (req, res) => {
    User.find({}).sort({ firstName: 'ascending' }).exec((err, docs) => {
      if (err) {
        console.log(err);
      }
      res.json(docs);
    });
  });

app.get('/:user_id',
  ensure.sameUser,
  (req, res) => {
    User.findById(req.params.user_id, (err, doc) => {
      res.send(doc);
    });
  });


app.post('/:user_id',
  ensure.sameUser, [
    // check('gender').optional().custom(value => {
    //   var genderOptions = ['male', 'female', 'other', ''];
    //   if (!genderOptions.includes(value)) {
    //     return Promise.reject('Select a gender from the dropdown.');
    //   } else {
    //     return true;
    //   }
    // }),
    check('affiliation').custom(value => {
      var affilOptions = ['undergraduate', 'graduate', 'other'];
      if (!affilOptions.includes(value)) {
        return Promise.reject('Select an affiliation from the dropdown.');
      } else {
        return true;
      }
    }),
    check('year').isNumeric().withMessage('Select a valid graduation year.'),
    check('livingGroup').optional().isLength({ min: 0, max: 100 }).withMessage('Living group has max character count of 100.'),
    check('experience').optional().isLength({ min: 0, max: 1000 }).withMessage('Experience field has max character count of 1000.'),
    check('image').custom(value => {
      var cropperPrefix = 'data:image\/png;base64,';
      var localPrefix = '/profile_images'
      if (!value.startsWith(cropperPrefix) && !value.startsWith(localPrefix)) {
        return Promise.reject('Choose a profile photo.');
      } else {
        return true;
      }
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    var updatedUserData = {
      gender: req.body.gender,
      affiliation: req.body.affiliation,
      year: req.body.year,
      livingGroup: req.body.livingGroup,
      experience: req.body.experience
    };
    
    // User must be found before writing a profile image to the server.
    User.findOneAndUpdate({
      _id: req.params.user_id
    }, updatedUserData, { new: true }).then((user) => {
      if (user === null) {
        res.status(403).send('Unauthorized request.');
      } else {
        var fileName = user._id.toString() + '.jpeg';
        var databaseUrl = user.imageUrl;

        // This processes images from the cropper.
        // Jimp stuff resize honestly only in place for malicious ppl.
        if (req.body.image.startsWith('data:image\/png;base64,')) {
          imageUrl = publicPath + '/profile_images/' + fileName;
          databaseUrl = '/profile_images/' + fileName;
          var base64Data = req.body.image.replace(/^data:image\/png;base64,/, '');
          jimp.read(Buffer.from(base64Data, 'base64'), (err, image) => {
            if (err) throw err;
            image
              .resize(512, 512)
              .write(imageUrl);
          });
        }
        user.imageUrl = databaseUrl;

        user.save((err, newUser) => {
          res.status(200).send({ message: 'User information updated!' });
        });
      }
    });
  }
);

module.exports = app;