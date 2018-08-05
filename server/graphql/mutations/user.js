const User = require('../../models/user');

function createUser(obj, { input }, context) {
  return User.create(input);
}

function updateUser(obj, { id, input }, context) {
  return User.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteUser(obj, { id }, context) {
  return User.findOneAndRemove({ _id: id });
}

module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
