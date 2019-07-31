const Show = require("../models/Show.js");

function getActiveShow() {
  return Show.findOne({isActive: true}).then(show => {
    return show;
  });
}

module.exports = {
  getActiveShow
};