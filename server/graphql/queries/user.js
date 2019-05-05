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
  return async obj => {
    if (obj && obj[ref]) {
      if (typeof obj[ref] === 'function') {
        return User.find({ _id: { $in: await obj[ref]() } });
      }
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
  if (obj && obj.users) {
    return User.find({ _id: { $in: obj.users } });
  }
  return User.find({});
}

function members(obj) {
  return User.find({ workshops: obj._id });
}

function memberCount(obj) {
  return members(obj).count();
}

function me(obj, args, { req }) {
  if (req.user) {
    return User.findOne({ email: req.user.email });
  }
  return null;
}

module.exports.userByRef = userByRef;
module.exports.usersByRef = usersByRef;
module.exports.user = user;
module.exports.users = users;
module.exports.members = members;
module.exports.memberCount = memberCount;
module.exports.me = me;
