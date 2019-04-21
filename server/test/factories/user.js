const User = require('../../models/user');
const Workshop = require('../../models/workshop');

async function testUser() {
  let user = await User.findOne({ email: 'test@example.com' });
  if (!user) {
    const workshop = await Workshop.findOne();
    user = await User.create({ email: 'test@example.com', workshop });
  }
  return user;
}

module.exports.testUser = testUser;
