function canUpdateUser(user, targetUser) {
  if (user && user.email === targetUser.email) {
    return true;
  }
  return new Error('Not authorized');
}

module.exports.canUpdateUser = canUpdateUser;
