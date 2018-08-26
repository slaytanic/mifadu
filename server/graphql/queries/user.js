const User = require('../../models/user');

function userByRef(ref) {
  return (obj, { id }) => {
    if (obj && obj[ref]) {
      return User.findOne({ _id: obj[ref] });
    }
    return User.findOne({ _id: id });
  };
}

function user(obj, args, context) {
  console.log('user obj', obj);
  if (obj && obj.user) {
    return User.findOne({ _id: obj.user });
  }
  return User.findOne({ _id: args.id });
}

function users(obj, args, context) {
  if (obj && obj.tutors) {
    return User.find({ _id: { $in: obj.tutors } });
  }
  return User.find({});
}

function me(obj, args, { req }) {
  return User.findOne({ email: req.user.email });
}

function myStudents(obj, args, { req }) {
  return User.find({ workshop: req.user.workshop });
}

module.exports.userByRef = userByRef;
module.exports.user = user;
module.exports.users = users;
module.exports.me = me;
module.exports.myStudents = myStudents;
