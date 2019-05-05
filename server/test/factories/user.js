const User = require('../../models/user');
const Workshop = require('../../models/workshop');

async function testUser() {
  let user = await User.findOne({ email: 'student@example.com' });
  if (!user) {
    const workshop = await Workshop.findOne();
    user = await User.create({ email: 'student@example.com', workshop });
  }
  return user;
}

async function testTutor() {
  let user = await User.findOne({ email: 'tutor@example.com' });
  if (!user) {
    const workshop = await Workshop.findOne();
    user = await User.create({ email: 'tutor@example.com', workshop });
    workshop.set({ tutors: [user] });
    await workshop.save();
  }
  return user;
}

module.exports.testUser = testUser;
module.exports.testTutor = testTutor;
