const Show = require("../models/Show.js");

const addHours = require("date-fns/add_hours");
const addDays = require("date-fns/add_days");
const startOfDay = require("date-fns/start_of_day");
// import addHours from 'date-fns/add_hours'
// import addDays from 'date-fns/add_days'
// import startOfDay from 'date-fns/start_of_day'

// Default dates. The month and day are ignored for processing for weekly scheduling. 
// Hardcoded to a random day that starts on Sunday.

const weekStartDate = new Date(2019, 8, 1);
const weekDays = 7; 
const weekStartHour = 15; // 3pm
const weekEndHour = 22.5; // 10:30 pm will be the last time slot rendered

// December 7, 2019
const prodStartDate = new Date(2019, 11, 7);
const prodDays = 3;
const prodStartHour = 10; // 10am
const prodEndHour = 23.5; // 11:30 pm is last slot

function getActiveShow() {
  return Show.findOne({isActive: true}).then(show => {
    return show;
  });
}

function getWeekTimes() {
  const startTime = startOfDay(weekStartDate);
  var times = [];
  for (var d = 0; d < weekDays; d++) {
    var currentDay = [];
    for (var h = weekStartHour; h <= weekEndHour; h += 0.5) {
      currentDay.push(addHours(addDays(startTime, d), h));
    }
    times.push(currentDay);
  }
  return times;
}

function getWeekStartEnd() {
  return { startTime: weekStartHour, endTime: weekEndHour }
}

function getProdTimes() {
  const startTime = startOfDay(prodStartDate);
  var times = [];
  for (var d = 0; d < prodDays; d++) {
    var currentDay = [];
    for (var h = prodStartHour; h <= prodEndHour; h += 0.5) {
      currentDay.push(addHours(addDays(startTime, d), h));
    }
    times.push(currentDay);
  }
  return times;
}

function getProdStartEnd() {
  return { startTime: prodStartHour, endTime: prodEndHour }
}

module.exports = {
  getActiveShow,
  getWeekTimes,
  getWeekStartEnd,
  getProdTimes,
  getProdStartEnd
};