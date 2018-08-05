const Tag = require('../../models/tag');

function createTag(obj, { input }, context) {
  return Tag.create(input);
}

function updateTag(obj, { id, input }, context) {
  return Tag.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteTag(obj, { id }, context) {
  return Tag.findOneAndRemove({ _id: id });
}

module.exports.createTag = createTag;
module.exports.updateTag = updateTag;
module.exports.deleteTag = deleteTag;
