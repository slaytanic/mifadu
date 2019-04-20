const Avatar = require('../../models/avatar');

function avatar(obj, { id }) {
  if (obj && obj.avatar) {
    return Avatar.findOne({ _id: obj.avatar });
  }
  return Avatar.findOne({ _id: id });
}

function avatars() {
  return Avatar.find({});
}

module.exports.avatar = avatar;
module.exports.avatars = avatars;
