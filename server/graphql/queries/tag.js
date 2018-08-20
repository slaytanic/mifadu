const Tag = require('../../models/tag');

function tag(obj, args, context) {
  return Tag.find({ _id: args.id });
}

function tags(obj, args, context) {
  if (obj && obj.tags) {
    return Tag.find({ _id: { $in: obj.tags } });
  }
  return Tag.find({});
}

module.exports.tag = tag;
module.exports.tags = tags;
