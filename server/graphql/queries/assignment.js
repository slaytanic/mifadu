const Assignment = require('../../models/assignment');
const Workshop = require('../../models/workshop');

function assignment(obj, args, { req }) {
  return Assignment.findOne({ _id: args.id });
}

function assignments(obj, { status }, { req }) {
  if (obj && status) {
    return Assignment.findByStatusForUser(status, req.user._id, obj._id);
  }
  return Assignment.find({});
}

function myAssignments(obj, args, { req }) {
  if (obj) {
    return Assignment.forUser(obj);
  }
  return Assignment.forUser(req.user);
}

function pendingAssignments(obj, args, { req }) {
  return new Promise((resolve, reject) => {
    Assignment.find({ workshop: obj._id }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(d => {
          if (d.requiredWork && d.requiredWork.length > 0) {
            const assignmentWork = d.requiredWork.map(rw =>
              rw.assignmentWork.find(aw => aw.user.equals(req.user._id)),
            );
            return (
              assignmentWork.filter(aw => aw && (aw.attachment || aw.content.length > 0)).length < 1
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
    Assignment.find({ workshop: obj._id }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(d => {
          if (d.requiredWork && d.requiredWork.length > 0) {
            const assignmentWork = d.requiredWork.map(rw =>
              rw.assignmentWork.find(aw => aw.user.equals(req.user._id)),
            );
            return (
              assignmentWork.filter(aw => aw && (aw.attachment || aw.content.length > 0)).length > 0
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

function statusTags(obj, args, { req }) {
  return obj.statusTagsForUser(req.user);
}

function assignmentWork(obj, args, { req }) {
  return obj.assignmentWorkForUser(req.user);
}

function myAssignmentWorks(obj, args, { req }) {
  return obj.assignmentWorksForUser(req.user);
}

function selfEvaluation(obj, args, { req }) {
  return obj.selfEvaluationForUser(req.user);
}

function myGroup(obj, args, { req }) {
  return obj.groupForUser(req.user);
}

async function workshopAssignments(obj, { status }, { req }) {
  if (status) {
    const assignments = await Assignment.find({ workshop: obj._id });
    if (obj.isTutor(req.user)) {
      if (status === 'pending') {
      } else if (status === 'completed') {
      }
    } else {
      if (status === 'pending') {
        return assignments.filter(async a =>
          (await a.statusTagsForUser(req.user)).includes('pending_work'),
        );
      }
      if (status === 'completed') {
        return assignments.filter(async a =>
          (await a.statusTagsForUser(req.user)).includes('completed_work'),
        );
      }
    }
  }
  return Assignment.find({ workshop: obj._id });
}

async function canEdit(obj, args, { req }) {
  if (!req.user) return false;

  return (await Workshop.findOne({ _id: obj.workshop, tutors: req.user._id }).count()) > 0;
}

function canSubmit(obj, args, { req }) {
  if (!req.user) return false;

  return true;
}

module.exports.assignment = assignment;
module.exports.assignments = assignments;
module.exports.myAssignments = myAssignments;
module.exports.pendingAssignments = pendingAssignments;
module.exports.completedAssignments = completedAssignments;
module.exports.pendingEvaluationAssignments = pendingEvaluationAssignments;
module.exports.completedEvaluationAssignments = completedEvaluationAssignments;
module.exports.statusTags = statusTags;
module.exports.assignmentWork = assignmentWork;
module.exports.myAssignmentWorks = myAssignmentWorks;
module.exports.selfEvaluation = selfEvaluation;
module.exports.myGroup = myGroup;
module.exports.workshopAssignments = workshopAssignments;
module.exports.canEdit = canEdit;
module.exports.canSubmit = canSubmit;
