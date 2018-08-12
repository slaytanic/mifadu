const Workshop = require('../models/workshop');
const Subject = require('../models/subject');
const Tag = require('../models/tag');

const workshops = require('./workshops');
const subjects = require('./subjects');
const tags = require('./tags');

function seeds() {
  workshops.forEach(workshop => Workshop.findOneAndUpdate({ name: workshop.name }, workshop, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());

  subjects.forEach(subject => Subject.findOneAndUpdate({ name: subject.name }, subject, {
    upsert: true,
    setDefaultsOnInsert: true,
  }).exec());

  tags.forEach(tag => Tag.findOneAndUpdate(
    { name: tag },
    { name: tag },
    {
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).exec());
}

module.exports = seeds;
