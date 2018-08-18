const Assignment = require('../../models/assignment');

function assignment(obj, args, context) {
  return Assignment.findOne({ _id: args.id });
}

function assignments(obj, args, context) {
  return Assignment.find({});
}

module.exports.assignment = assignment;
module.exports.assignments = assignments;
