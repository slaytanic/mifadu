const University = require('../../models/university');

function university(obj, args, context) {
  return University.find({ _id: args.id });
}

function universities(obj, args, context) {
  return University.find({});
}

module.exports.university = university;
module.exports.universities = universities;
