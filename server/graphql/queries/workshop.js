const Workshop = require('../../models/workshop');

function workshopsByRef(ref) {
  return obj => {
    if (obj && obj[ref]) {
      return Workshop.find({ _id: { $in: obj[ref] } }).sort({ name: 'asc' });
    }
    return [];
  };
}

function workshop(obj, { id }) {
  if (obj && obj.workshop) {
    return Workshop.findOne({ _id: obj.workshop });
  }
  if (obj && obj.workshops) {
    return Workshop.findOne({ _id: obj.workshops, year: new Date().getFullYear() });
  }
  return Workshop.findOne({ _id: id });
}

function workshops(obj) {
  if (obj && obj.workshops) {
    return Workshop.find({ _id: { $in: obj.workshops } }).sort({ name: 'asc' });
  }
  return Workshop.find({}).sort({ name: 'asc' });
}

function myWorkshops(obj, args, { req }) {
  return Workshop.find({ tutors: req.user._id }).sort({ name: 'asc' });
}

function isTutor(obj, args, { req }) {
  return obj.isTutor(req.user._id);
}

function members(obj) {
  return obj.members();
}

function memberCount(obj) {
  return obj.memberCount();
}

module.exports.workshopsByRef = workshopsByRef;
module.exports.workshop = workshop;
module.exports.workshops = workshops;
module.exports.myWorkshops = myWorkshops;
module.exports.isTutor = isTutor;
module.exports.members = members;
module.exports.memberCount = memberCount;
