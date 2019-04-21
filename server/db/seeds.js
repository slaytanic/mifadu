const Workshop = require('../models/workshop');
const Subject = require('../models/subject');
const Tag = require('../models/tag');
const User = require('../models/user');

const workshops = require('./workshops');
const subjects = require('./subjects');
const tags = require('./tags');

async function seeds() {
  await Promise.all(
    workshops.map(async (w) => {
      let workshop = await Workshop.findOne({ name: w.name, year: new Date().getFullYear() });

      if (!workshop) {
        workshop = new Workshop();
      }

      workshop.set({ name: w.name, year: new Date().getFullYear() });
      await workshop.save();

      let student = await User.findOne({ email: w.student });
      if (!student) {
        student = new User();
      }
      student.set({
        email: w.student,
        password: 'Password1',
        firstName: w.name,
        lastName: 'Estudiante',
        workshop: workshop._id,
        completedProfile: true,
        acceptedTerms: true,
      });
      await student.save();

      let tutor = await User.findOne({ email: w.tutor });
      if (!tutor) {
        tutor = new User();
      }
      tutor.set({
        email: w.tutor,
        password: 'Password1',
        firstName: w.name,
        lastName: 'JTP',
        workshop: workshop._id,
        completedProfile: true,
        acceptedTerms: true,
      });
      await tutor.save();

      workshop.tutors.pull(tutor._id).push(tutor._id);
      return workshop.save();
    }),
  );

  await Promise.all(
    subjects.map(subject => Subject.findOneAndUpdate({ name: subject.name }, subject, {
      upsert: true,
      setDefaultsOnInsert: true,
    }).exec()),
  );

  await Promise.all(
    tags.map(tag => Tag.findOneAndUpdate({ name: tag.name }, tag, {
      upsert: true,
      setDefaultsOnInsert: true,
    }).exec()),
  );
}

module.exports = seeds;
