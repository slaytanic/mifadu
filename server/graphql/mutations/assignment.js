const fs = require('fs');

const stripExt = require('../../lib/stripExt');
const cloudinary = require('../../cloudinary');

const Assignment = require('../../models/assignment');

function createAssignment(obj, { input }, { req }) {
  if (req.files && req.files.length > 0) {
    return new Promise((resolve, reject) => {
      const assignment = new Assignment({
        ...input,
        workshop: req.user.workshop,
      });
      assignment.save((err, doc) => {
        if (err) {
          fs.unlink(req.files[0].path);
          return reject(err);
        }
        return cloudinary.v2.uploader.upload(
          req.files[0].path,
          {
            public_id: `${doc.attachment._id}/${stripExt(doc.attachment.name)}`,
            overwrite: true,
          },
          (uploadErr, uploadRes) => {
            if (uploadErr) {
              return reject(uploadErr);
            }
            fs.unlink(req.files[0].path);
            assignment.attachment.set({ url: uploadRes.secure_url });
            return resolve(assignment.save());
          },
        );
      });
    });
  }
  return Assignment.create(input);
}

async function updateAssignment(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  return new Promise((resolve, reject) => {
    assignment.set({ ...input, workshop: req.user.workshop });
    if (!req.files || req.files.length < 1) {
      return resolve(assignment.save());
    }
    return assignment.save((err, doc) => {
      if (err) {
        fs.unlink(req.files[0].path);
        return reject(err);
      }
      return cloudinary.v2.uploader.upload(
        req.files[0].path,
        {
          public_id: `${doc.attachment._id}/${stripExt(
            req.files[0].originalname,
          )}`,
          overwrite: true,
        },
        (uploadErr, uploadRes) => {
          if (uploadErr) {
            return reject(uploadErr);
          }
          fs.unlink(req.files[0].path);
          assignment.attachment.set({ url: uploadRes.secure_url });
          return resolve(assignment.save());
        },
      );
    });
  });
}

async function submitAssignmentWork(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  assignment.requiredWork.forEach((rw) => {
    if (!input.assignmentWork) {
      return;
    }

    const newAssignmentWork = input.assignmentWork.find(
      aw => aw.requiredWorkId === rw.id,
    );
    if (!newAssignmentWork) {
      return;
    }
    const assignmentWork = rw.assignmentWork.filter(
      aw => aw.user.toString() !== req.user._id,
    );
    const oldAssignmentWork = rw.assignmentWork.find(
      aw => aw.user.toString() === req.user._id,
    );

    assignmentWork.push({
      content: newAssignmentWork.content,
      attachment:
        newAssignmentWork.attachment
        || (oldAssignmentWork && oldAssignmentWork.attachment),
      user: req.user._id,
    });
    rw.set({ assignmentWork });
  });

  assignment.set({
    evaluations: (assignment.evaluations || [])
      .filter(e => e.user.toString() !== req.user._id)
      .concat({
        ...input.evaluation,
        user: req.user._id,
        targetUser: req.user._id,
      }),
  });
  return new Promise((resolve, reject) => {
    assignment.save((err, doc) => {
      if (err) {
        return reject(err);
      }
      let newDoc = doc;
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (f) => {
          const requiredWorkId = f.fieldname;
          const requiredWork = doc.requiredWork.id(requiredWorkId);
          const assignmentWork = requiredWork.assignmentWork.find(aw => aw.user.equals(req.user._id));
          const upload = await cloudinary.v2.uploader.upload(f.path, {
            public_id: `${assignmentWork._id}/${stripExt(f.originalname)}`,
            overwrite: true,
          });
          assignmentWork.attachment.set({ url: upload.secure_url });
          newDoc = await doc.save();
        });
      }
      return resolve(newDoc);
    });
  });
}

async function submitAssignmentEvaluation(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  const evaluations = (assignment.evaluations || []).filter(
    e => !e.user.equals(req.user._id),
  );
  evaluations.push({
    ...input.evaluation,
    user: req.user._id,
    targetUser: input.targetUser,
  });
  assignment.set({ evaluations });
  return assignment.save();
}

function deleteAssignment(obj, { id }) {
  return Assignment.findOneAndRemove({ _id: id });
}

module.exports.createAssignment = createAssignment;
module.exports.updateAssignment = updateAssignment;
module.exports.submitAssignmentWork = submitAssignmentWork;
module.exports.submitAssignmentEvaluation = submitAssignmentEvaluation;
module.exports.deleteAssignment = deleteAssignment;
