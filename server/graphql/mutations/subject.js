const Subject = require('../../models/subject');

function createSubject(obj, { input }, context) {
  return Subject.create(input);
}

function updateSubject(obj, { id, input }, context) {
  return Subject.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteSubject(obj, { id }, context) {
  return Subject.findOneAndRemove({ _id: id });
}

module.exports.createSubject = createSubject;
module.exports.updateSubject = updateSubject;
module.exports.deleteSubject = deleteSubject;
