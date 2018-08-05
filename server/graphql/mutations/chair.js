const Chair = require('../../models/chair');

function createChair(obj, { input }, context) {
  return Chair.create(input);
}

function updateChair(obj, { id, input }, context) {
  return Chair.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteChair(obj, { id }, context) {
  return Chair.findOneAndRemove({ _id: id });
}

module.exports.createChair = createChair;
module.exports.updateChair = updateChair;
module.exports.deleteChair = deleteChair;
