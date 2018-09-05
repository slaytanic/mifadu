const Workshop = require('../../models/workshop');

function workshop(obj, args, context) {
  if (obj && obj.workshop) {
    return Workshop.findOne({ _id: obj.workshop });
  }
  return Workshop.findOne({ _id: args.id });
}

function workshops(obj, args, context) {
  if (obj && obj._id) {
    return Workshop.find({ tutors: obj._id });
  }
  return Workshop.find({});
}

function myWorkshops(obj, args, { req }) {
  return Workshop.find({ tutors: req.user._id });
}

module.exports.workshop = workshop;
module.exports.workshops = workshops;
module.exports.myWorkshops = myWorkshops;
