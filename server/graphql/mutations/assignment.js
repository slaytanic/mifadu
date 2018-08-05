const Assignment = require('../../models/assignment');

function createAssignment(obj, { input }, context) {
  return Assignment.create(input);
}

function updateAssignment(obj, { id, input }, context) {
  return Assignment.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteAssignment(obj, { id }, context) {
  return Assignment.findOneAndRemove({ _id: id });
}

module.exports.createAssignment = createAssignment;
module.exports.updateAssignment = updateAssignment;
module.exports.deleteAssignment = deleteAssignment;
