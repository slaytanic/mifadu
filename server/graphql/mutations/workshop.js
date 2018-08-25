const Workshop = require('../../models/workshop');

function createWorkshop(obj, { input }, { req }) {
  return Workshop.create({ ...input, workshop: req.user.workshop });
}

function updateWorkshop(obj, { id, input }, context) {
  return Workshop.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteWorkshop(obj, { id }, context) {
  return Workshop.findOneAndRemove({ _id: id });
}

module.exports.createWorkshop = createWorkshop;
module.exports.updateWorkshop = updateWorkshop;
module.exports.deleteWorkshop = deleteWorkshop;
