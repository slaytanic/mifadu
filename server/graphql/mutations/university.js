const University = require('../../models/university');

function createUniversity(obj, { input }, context) {
  return University.create(input);
}

function updateUniversity(obj, { id, input }, context) {
  return University.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteUniversity(obj, { id }, context) {
  return University.findOneAndRemove({ _id: id });
}

module.exports.createUniversity = createUniversity;
module.exports.updateUniversity = updateUniversity;
module.exports.deleteUniversity = deleteUniversity;
