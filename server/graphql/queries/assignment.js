const Assignment = require('../../models/assignment');

function assignment(obj, args, context) {
  return Assignment.findOne({ _id: args.id });
}

function assignments(obj, args, context) {
  return Assignment.find({});
}

function pendingAssignments(obj, args, context) {}

function completedAssignments(obj, args, context) {}

module.exports.assignment = assignment;
module.exports.assignments = assignments;
module.exports.pendingAssignments = pendingAssignments;
module.exports.completedAssignments = completedAssignments;
