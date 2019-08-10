const Show = require("../models/Show.js");

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
  var times = [];
  for (var d = 0; d < weekDays; d++) {
    var currentDay = [];
    for (var h = weekStartHour; h <= weekEndHour; h += 0.5) {
      var time = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + d, Math.floor(h));
      if (h % 1 === 0.5) { // half hour
        time.setMinutes(30);
      }
      currentDay.push(time.toISOString()) ;
    }
    times.push(currentDay);
  }
  return times;
}

function getWeekStartEnd() {
  return {startTime: weekStartHour, endTime: weekEndHour}
}

function getProdTimes() {
  var times = [];
  for (var d = 0; d < prodDays; d++) {
    var currentDay = [];
    for (var h = prodStartHour; h <= prodEndHour; h += 0.5) {
      var time = new Date(prodStartDate.getFullYear(), prodStartDate.getMonth(), prodStartDate.getDate() + d, Math.floor(h));
      if (h % 1 === 0.5) { // half hour
        time.setMinutes(30);
      } 
      currentDay.push(time.toISOString());
    }
    times.push(currentDay);
  }
  return times;
}

function getProdStartEnd() {
  return {startTime: prodStartHour, endTime: prodEndHour}
}

module.exports = {
  getActiveShow,
  getWeekTimes,
  getWeekStartEnd,
  getProdTimes,
  getProdStartEnd
};