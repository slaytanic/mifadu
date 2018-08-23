const Assignment = require('../../models/assignment');

async function assignment(obj, args, { req }) {
  const a = await Assignment.findOne({ _id: args.id }).lean();
  a.id = a._id;
  a.requiredWork = a.requiredWork.map((rw) => {
    const assignmentWork = rw.assignmentWork.find(aw => aw.user.equals(req.user._id));
    assignmentWork.id = assignmentWork._id;
    return {
      ...rw,
      id: rw._id,
      assignmentWork,
    };
  });
  return a;
}

function assignments(obj, args, context) {
  return Assignment.find({});
}

function pendingAssignments(obj, args, context) {
  return Assignment.find({ requiredWork });
}

function completedAssignments(obj, args, context) {}

module.exports.assignment = assignment;
module.exports.assignments = assignments;
module.exports.pendingAssignments = pendingAssignments;
module.exports.completedAssignments = completedAssignments;
