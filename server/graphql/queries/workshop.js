const Workshop = require('../../models/workshop');
const Assignment = require('../../models/assignment');

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
  return obj.isTutor(req.user);
}

function members(obj) {
  return obj.members();
}

function memberCount(obj) {
  return obj.memberCount();
}

async function pendingAssignmentCount(obj, args, { req }) {
  const assignments = await Assignment.find({ workshop: obj._id });

  if (obj.isTutor(req.user)) {
    return assignments.reduce((acc, assignment) => {
      return acc + assignment.usersWithoutEvaluations.length;
    }, 0);
  }
  return assignments.reduce(async (acc, assignment) => {
    if ((await assignment.statusTagsForUser(req.user)).includes('pending_work')) {
      return (await acc) + 1;
    }
    return acc;
  }, 0);
}

async function completedAssignmentCount(obj, args, { req }) {
  const assignments = await Assignment.find({ workshop: obj._id });

  if (obj.isTutor(req.user)) {
    return assignments.reduce((acc, assignment) => {
      return acc + assignment.usersWithEvaluations.length;
    }, 0);
  }
  return assignments.reduce(async (acc, assignment) => {
    if ((await assignment.statusTagsForUser(req.user)).includes('completed_work')) {
      return (await acc) + 1;
    }
    return acc;
  }, 0);
}

module.exports.workshopsByRef = workshopsByRef;
module.exports.workshop = workshop;
module.exports.workshops = workshops;
module.exports.myWorkshops = myWorkshops;
module.exports.isTutor = isTutor;
module.exports.members = members;
module.exports.memberCount = memberCount;
module.exports.pendingAssignmentCount = pendingAssignmentCount;
module.exports.completedAssignmentCount = completedAssignmentCount;
