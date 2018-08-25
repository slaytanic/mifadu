const Workshop = require('../models/workshop');
const Subject = require('../models/subject');
const Tag = require('../models/tag');
const User = require('../models/user');

const workshops = require('./workshops');
const subjects = require('./subjects');
const tags = require('./tags');

function seeds() {
  workshops.forEach((workshop) => {
    Workshop.findOneAndUpdate(
      { name: workshop.name },
      workshop,
      {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true,
      },
      (err, doc) => {
        User.findOne({ email: workshop.student }, (userErr, user) => {
          let myUser = user;
          if (!myUser) {
            myUser = new User();
          }
          myUser.set({
            email: workshop.student,
            password: 'Password1',
            firstName: workshop.name,
            lastName: 'Estudiante',
            workshop: doc._id,
            completedProfile: true,
            acceptedTerms: true,
          });
          myUser.save();
        });
        User.findOne({ email: workshop.tutor }, (userErr, user) => {
          let myUser = user;
          if (!myUser) {
            myUser = new User();
          }
          myUser.set({
            email: workshop.tutor,
            password: 'Password1',
            firstName: workshop.name,
            lastName: 'JTP',
            workshop: doc._id,
            completedProfile: true,
            acceptedTerms: true,
          });
          myUser.save((saveErr, saveUser) => {
            doc.set({ tutors: [saveUser._id] });
            doc.save();
          });
        });
      },
    );
  });

  subjects.forEach(subject => Subject.findOneAndUpdate({ name: subject.name }, subject, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());

  tags.forEach(tag => Tag.findOneAndUpdate({ name: tag.name }, tag, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());
}

module.exports = seeds;
