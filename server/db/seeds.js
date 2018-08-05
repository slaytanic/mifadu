const Workshop = require('../models/workshop');
const Subject = require('../models/subject');

const workshops = require('./workshops');
const subjects = require('./subjects');

function seeds() {
  workshops.forEach(workshop => Workshop.findOneAndUpdate({ name: workshop.name }, workshop, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());

  subjects.forEach(subject => Subject.findOneAndUpdate({ name: subject.name }, subject, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());
}

module.exports = seeds;
