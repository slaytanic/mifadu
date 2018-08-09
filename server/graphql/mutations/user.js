const User = require('../../models/user');

const passport = require('../../passport');

function createUser(obj, { input }, context) {
  return User.create(input);
}

function createOrUpdateUser(obj, { input }, context) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: input.email }, (err, doc) => {
      if (err) { return reject(err); }
      if (doc) {
        doc.set(input);
        doc.save((saveErr) => {
          if (saveErr) { return reject(saveErr); }
          return resolve(doc);
        });
      }
      const user = new User(input);
      return user.save((saveErr) => {
        if (saveErr) { return reject(saveErr); }
        return resolve(user);
      });
    });
  });
}

function updateUser(obj, { id, input }, context) {
  return User.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteUser(obj, { id }, context) {
  return User.findOneAndRemove({ _id: id });
}

function loginUser(obj, args, { req, res, next }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) {
        return reject(error);
      }
      if (!user) {
        return reject(info.message);
      }

      return req.login(user, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve(user);
      });
    })({ body: { username: args.email, password: args.password } }, res, next);
  });
}

function logoutUser(obj, args, { req }) {
  req.logout();
  return true;
}

module.exports.createUser = createUser;
module.exports.createOrUpdateUser = createOrUpdateUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
