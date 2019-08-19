const express = require('express');
const csv = require('express-csv');

const Dance = require('../../models/Dance.js');
const Prefsheet = require('../../models/Prefsheet.js');

const ensure = require("../ensure");
const util = require("../util");

const app = express.Router();

// These paths are prefixed by /reports/ENDPOINT.

// Returns csv for showcase with all dances in the active show with name, style, level, description.
app.get('/master-dances',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    var query = { show: show_id }

    Dance
      .find(query)
      .sort('style')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        };
        data = [
          ['Name', 'Style', 'Level', 'Description']
        ];
        docs.forEach((doc) => {
          data.push([doc.name, doc.style, doc.level, doc.description]);
        });
        res.csv(data);
      });
  });

// Returns csv of all emails of dancers who submitted prefsheets for the active show.
app.get('/master-audition-emails',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    var query = { show: show_id }

    Prefsheet
      .find(query)
      .populate('user', 'email')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        };
        data = [
          ['Email']
        ];
        docs.forEach((doc) => {
          data.push([doc.user.email]);
        });
        res.csv(data);
      });
  });

// Returns csv of audition number assigned to dancer with audition number, first name, last name, email.
app.get('/master-assignments',
  ensure.admin,
  async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).send('Unauthorized request.')
    }
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    var query = { show: show_id }

    Prefsheet
      .find(query)
      .populate('user', 'firstName lastName email')
      .sort('auditionNumber')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        };
        data = [
          ['Number', 'First Name', 'Last Name', 'Email']
        ];
        docs.forEach((doc) => {
          data.push([doc.auditionNumber, doc.user.firstName, doc.user.lastName, doc.user.email]);
        });
        res.csv(data);
      });
  });

// Returns csv of prefsheet to dance, a blank line indicating a new dance. Sorted by both audition num and pref.
app.get('/dance-audition-sheets',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    var query = { show: show_id }

    Prefsheet
      .find(query)
      .populate('user', 'firstName lastName')
      .exec(async (err, docs) => {
        if (err) {
          console.log(err);
        };
        var usersByDance = {}
        docs.forEach((doc) => {
          doc.rankedDances.forEach((rankedDance, index) => {
            var userList =
              usersByDance.hasOwnProperty(rankedDance.dance) ?
                usersByDance[rankedDance.dance] : [];
            usersByDance[rankedDance.dance] = userList.concat([
              [doc.auditionNumber,
              index + 1,
              doc.user.firstName + ' ' + doc.user.lastName,
              doc.maxDances]
            ]);
          })
        });

        data = [];
        header = ['#', 'Pref', 'Name', 'Desired', 'Dance Name'];
        for (const [danceId, userList] of Object.entries(usersByDance)) {
          const dance = await Dance.findById(danceId);
          userListCopy = [...userList];
          // Sort by audition number
          data.push(['Dancers by Audition Number'], header);
          userListCopy.sort((a, b) => a[0] - b[0]);
          userListCopy.forEach(row => {
            data.push(row.concat(dance.name));
          });

          data.push(['Dancers by Pref'], header);
          // Sort by pref
          userListCopy.sort((a, b) => a[1] - b[1]);
          userListCopy.forEach(row => {
            data.push(row.concat(dance.name));
          });
        }
        res.csv(data);
      })

  });

// Returns csv of final dancers for the entire SHOW with first name, last name, year, email.
app.get('/master-final',
  ensure.admin,
  async (req, res) => {
    var showResponse = await util.getActiveShow();
    var show_id = showResponse._id;

    var query = { show: show_id }

    Dance
      .find(query)
      .populate('acceptedDancers', 'firstName lastName year email')
      .exec((err, docs) => {
        if (err) {
          console.log(err);
        };
        var usersByEmail = {}
        var uniqueEmails = new Set();
        docs.forEach((doc) => {
          doc.acceptedDancers.forEach((user => {
            usersByEmail[user.email] = [user.firstName, user.lastName, user.year];
            uniqueEmails.add(user.email);
          }))
        });
        data = [
          ['First Name', 'Last Name', 'Year', 'Email']
        ];
        uniqueEmails.forEach(email => {
          var row = usersByEmail[email].concat(email);
          data.push(row);
        })
        res.csv(data);
      })
  });

// Returns csv of final dancers for the given DANCE with first name, last name, year, email.
app.get('/dance-final/:dance_id',
  ensure.choreographer,
  (req, res) => {
    Dance
      .findById(req.params.dance_id)
      .populate('acceptedDancers', 'firstName lastName year email')
      .exec((err, doc) => {
        if (err) {
          console.log(err);
        };
        data = [
          [doc.name],
          ['First Name', 'Last Name', 'Year', 'Email']
        ];
        doc.acceptedDancers.forEach((user) => {
          data.push([user.firstName, user.lastName, user.year, user.email]);
        });
        res.csv(data);
      });
  });


module.exports = app;