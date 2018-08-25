const User = require('../../models/user');

function user(obj, args, context) {
  return User.find({ _id: args.id });
}

function users(obj, args, context) {
  return User.find({});
}

function me(obj, args, { req }) {
  return User.findOne({ email: req.user.email });
}

function myStudents(obj, args, { req }) {
  return User.find({ workshop: req.user.workshop });
}

module.exports.user = user;
module.exports.users = users;
module.exports.me = me;
module.exports.myStudents = myStudents;
