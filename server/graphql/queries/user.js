const User = require('../../models/user');

function userByRef(ref) {
  return (obj, { id }) => {
    if (obj && obj[ref]) {
      return User.findOne({ _id: obj[ref] });
    }
    return User.findOne({ _id: id });
  };
}

function usersByRef(ref) {
  return (obj) => {
    if (obj && obj[ref]) {
      return User.find({ _id: { $in: obj[ref] } });
    }
    return null;
  };
}

function user(obj, args) {
  if (obj && obj.user) {
    return User.findOne({ _id: obj.user });
  }
  return User.findOne({ _id: args.id });
}

function users(obj) {
  if (obj && obj.tutors) {
    return User.find({ _id: { $in: obj.tutors } });
  }
  return User.find({});
}

function me(obj, args, { req }) {
  if (req.user) {
    return User.findOne({ email: req.user.email });
  }
  return null;
}

function myStudents(obj, args, { req }) {
  return User.find({ workshop: req.user.workshop });
}

module.exports.userByRef = userByRef;
module.exports.usersByRef = usersByRef;
module.exports.user = user;
module.exports.users = users;
module.exports.me = me;
module.exports.myStudents = myStudents;
