const Subject = require('../../models/subject');

function subject(obj, args, context) {
  return Subject.find({ _id: args.id });
}

function subjects(obj, args, context) {
  return Subject.find({});
}

module.exports.subject = subject;
module.exports.subjects = subjects;
