const Workshop = require('../../models/workshop');

function workshop(obj, args, context) {
  return Workshop.find({ _id: args.id });
}

function workshops(obj, args, context) {
  return Workshop.find({});
}

function myWorkshops(obj, args, { req }) {
  return Workshop.find({ tutors: req.user._id });
}

module.exports.workshop = workshop;
module.exports.workshops = workshops;
module.exports.myWorkshops = myWorkshops;
