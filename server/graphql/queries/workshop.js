const Workshop = require('../../models/workshop');

function workshopsByRef(ref) {
  return (obj) => {
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

module.exports.workshopsByRef = workshopsByRef;
module.exports.workshop = workshop;
module.exports.workshops = workshops;
module.exports.myWorkshops = myWorkshops;
