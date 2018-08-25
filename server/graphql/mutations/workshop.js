const Workshop = require('../../models/workshop');

function createWorkshop(obj, { input }) {
  return Workshop.create(input);
}

function updateWorkshop(obj, { id, input }) {
  return Workshop.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteWorkshop(obj, { id }) {
  return Workshop.findOneAndRemove({ _id: id });
}

module.exports.createWorkshop = createWorkshop;
module.exports.updateWorkshop = updateWorkshop;
module.exports.deleteWorkshop = deleteWorkshop;
