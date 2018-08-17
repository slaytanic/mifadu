const Assignment = require('../../models/assignment');

function createAssignment(obj, { input }, { req }) {
  return Assignment.create(input);
}

function updateAssignment(obj, { id, input }, context) {
  return Assignment.findOneAndUpdate({ _id: id }, input, { new: true });
}

async function updateAssignmentWork(obj, { id, input }, { req, res, next }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  const assignmentWork = { ...input, user: req.user._id };
}

function deleteAssignment(obj, { id }, context) {
  return Assignment.findOneAndRemove({ _id: id });
}

module.exports.createAssignment = createAssignment;
module.exports.updateAssignment = updateAssignment;
module.exports.deleteAssignment = deleteAssignment;
