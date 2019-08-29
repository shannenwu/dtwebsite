const crypto = require('crypto');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');

const User = require('../../models/User');

const app = express.Router();

app.post('/forgot', [
  check('email').isEmail().withMessage('Valid email required!'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  var token = crypto.randomBytes(20).toString('hex');
  User.findOneAndUpdate({
    email: req.body.email
  }, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    }, (err, user) => {
      if (user === null) {
        res.status(403).send({message: 'Email not registered.'});
      } else {
        const transporter = nodemailer.createTransport({
          host: 'outgoing.mit.edu',
          port: 587,
          secure: false,
          auth: {
            user: process.env.KERBEROS,
            pass: process.env.KERBEROS_PASSWORD
          }
        });

        // TODO change local link later
        const mailOptions = {
          from: 'dt-officers@mit.edu',
          to: `${user.email}`,
          subject: 'Password Reset Request for MIT Dance Troupe',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://dancetroupe.mit.edu/reset/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send({ message: 'Failed to send recovery email. Please contact us with your issue.' })
          } else {
            res.status(200).send({ message: 'Recovery email sent!' });
          }
        });
      }
    });
});

module.exports = app;