const Assignment = require('../../models/assignment');

async function assignment(obj, args, { req }) {
  const a = await Assignment.findOne({ _id: args.id }).lean();
  a.id = a._id;
  a.requiredWork = a.requiredWork.map((rw) => {
    const assignmentWork = rw.assignmentWork.find(aw => aw.user.equals(req.user._id));
    if (!assignmentWork) {
      return { ...rw, id: rw._id };
    }
    assignmentWork.id = assignmentWork._id;
    return {
      ...rw,
      id: rw._id,
      assignmentWork,
      assignmentWorks: rw.assignmentWork,
    };
  });
  a.attachment.id = a.attachment._id;
  a.evaluation = a.evaluations.find(e => e.user.equals(req.user._id));
  a.evaluations = a.evaluations.map(e => ({ ...e, id: e._id }));
  console.log(a);
  return a;
}

function assignments(obj, args, context) {
  return Assignment.find({});
}

function myAssignments(obj, args, { req }) {
  return Assignment.forUser(req.user);
}

function pendingAssignments(obj, args, { req }) {
  return new Promise((resolve, reject) => {
    Assignment.find({ workshop: req.user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter((d) => {
          if (d.requiredWork && d.requiredWork.length > 0) {
            const assignmentWork = d.requiredWork.map(rw => rw.assignmentWork.find(aw => aw.user.equals(req.user._id)));
            return (
              assignmentWork.filter(
                aw => aw && (aw.attachment || aw.content.length > 0),
              ).length < 1
            );
          }
          return true;
        }),
      );
    });
  });
}

function completedAssignments(obj, args, { req }) {
  return new Promise((resolve, reject) => {
    Assignment.find({ workshop: req.user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter((d) => {
          if (d.requiredWork && d.requiredWork.length > 0) {
            const assignmentWork = d.requiredWork.map(rw => rw.assignmentWork.find(aw => aw.user.equals(req.user._id)));
            return (
              assignmentWork.filter(
                aw => aw && (aw.attachment || aw.content.length > 0),
              ).length > 0
            );
          }
          return false;
        }),
      );
    });
  });
}

function pendingEvaluationAssignments(obj, args, { req }) {
  return Assignment.pendingEvaluationByUser(req.user);
}

function completedEvaluationAssignments(obj, args, { req }) {
  return Assignment.completedEvaluationByUser(req.user);
}

module.exports.assignment = assignment;
module.exports.assignments = assignments;
module.exports.myAssignments = myAssignments;
module.exports.pendingAssignments = pendingAssignments;
module.exports.completedAssignments = completedAssignments;
module.exports.pendingEvaluationAssignments = pendingEvaluationAssignments;
module.exports.completedEvaluationAssignments = completedEvaluationAssignments;
