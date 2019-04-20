const { AuthenticationError, ForbiddenError } = require('apollo-server');

const User = require('../../models/user');
const { canUpdateUser } = require('../policies/user');
const passport = require('../../passport');

function createUser(obj, { input }) {
  return User.create(input);
}

async function createOrUpdateUser(obj, { input }, { req }) {
  let user = await User.findOne({ email: input.email });
  if (user) {
    const authorized = canUpdateUser(req.user, user);
    if (authorized === true) {
      user.set(input);
      await user.save();
      return new Promise((resolve, reject) => req.login(user, (loginErr) => {
        if (loginErr) reject(loginErr);
        resolve(user);
      }));
    }
    throw new ForbiddenError('You are not authorized to change the information for this user');
  }
  user = new User(input);
  await user.save();
  return new Promise((resolve, reject) => req.login(user, (loginErr) => {
    if (loginErr) reject(loginErr);
    resolve(user);
  }));
}

function updateUser(obj, { id, input }) {
  return User.findOneAndUpdate({ _id: id }, input, { new: true });
}

function deleteUser(obj, { id }) {
  return User.findOneAndRemove({ _id: id });
}

function loginUser(obj, { email, password }, { req, res, next }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) {
        reject(new AuthenticationError(error));
      }
      if (!user) {
        reject(new AuthenticationError(info.message));
      }

      return req.login(user, (loginErr) => {
        if (loginErr) reject(loginErr);
        resolve(user);
      });
    })({ body: { username: email, password } }, res, next);
  });
}

function logoutUser(obj, args, { req }) {
  req.logout();
  return req.user;
}

function recoverPassword(obj, { email }) {
  return User.recoverPassword(email);
}

async function resetPassword(obj, { password, recoveryToken }, context) {
  if (!recoveryToken) {
    return null;
  }

  const user = await User.findOne({ recoveryToken });
  if (user) {
    user.set({ password, recoveryToken: null });
    await user.save();
    return loginUser(obj, { email: user.email, password }, context);
  }

  return null;
}

module.exports.createUser = createUser;
module.exports.createOrUpdateUser = createOrUpdateUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.recoverPassword = recoverPassword;
module.exports.resetPassword = resetPassword;
