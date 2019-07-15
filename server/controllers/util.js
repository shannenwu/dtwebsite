const Show = require("../models/Show.js");

function getActiveShow() {
  return Show.find({}).then(shows => {
    for (let show of shows) {
      if (show.isActive) {
        return show;
      }
    }
  });
}

module.exports = {
  getActiveShow
};