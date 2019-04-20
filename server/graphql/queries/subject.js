const Subject = require('../../models/subject');

function subject(obj, { id }) {
  if (obj && obj.subject) {
    return Subject.findOne({ _id: obj.subject });
  }
  return Subject.findOne({ _id: id });
}

function subjects(obj) {
  if (obj && obj.subjects) {
    return Subject.find({ _id: { $in: obj.subjects } }).sort({ name: 'asc' });
  }
  return Subject.find({}).sort({ name: 'asc' });
}

module.exports.subject = subject;
module.exports.subjects = subjects;
