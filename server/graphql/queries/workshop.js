const Workshop = require('../../models/workshop');

function workshop(obj, args, context) {
  return Workshop.find({ _id: args.id });
}

function workshops(obj, args, context) {
  return Workshop.find({});
}

module.exports.workshop = workshop;
module.exports.workshops = workshops;
