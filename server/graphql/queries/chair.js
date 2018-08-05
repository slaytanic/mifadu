const Chair = require('../../models/chair');

function chair(obj, args, context) {
  return Chair.find({ _id: args.id });
}

function chairs(obj, args, context) {
  return Chair.find({});
}

module.exports.chair = chair;
module.exports.chairs = chairs;
