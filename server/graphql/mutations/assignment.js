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
          fs.unlinkSync(req.files[0].path);
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
              fs.unlinkSync(req.files[0].path);
              return reject(uploadErr);
            }
            console.info('unlink', req.files[0].path);
            fs.unlinkSync(req.files[0].path);
            assignment.attachment.set({ url: uploadRes.secure_url });
            return resolve(assignment.save());
          },
        );
      });
    });
  }
  return Assignment.create({ ...input, workshop: req.user.workshop });
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
        fs.unlinkSync(req.files[0].path);
        return reject(err);
      }
      return cloudinary.v2.uploader.upload(
        req.files[0].path,
        {
          public_id: `${doc.attachment._id}/${stripExt(req.files[0].originalname)}`,
          overwrite: true,
        },
        (uploadErr, uploadRes) => {
          console.info('unlink', req.files[0].path);
          fs.unlinkSync(req.files[0].path);

          if (uploadErr) {
            return reject(uploadErr);
          }
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

    const newAssignmentWork = input.assignmentWork.find(aw => aw.requiredWorkId === rw.id);
    if (!newAssignmentWork) {
      return;
    }
    const assignmentWorks = rw.assignmentWorks.filter(aw => aw.user.toString() !== req.user._id);
    const oldAssignmentWorks = rw.assignmentWorks.find(aw => aw.user.toString() === req.user._id);

    assignmentWorks.push({
      content: newAssignmentWork.content,
      attachment:
        newAssignmentWork.attachment || (oldAssignmentWorks && oldAssignmentWorks.attachment),
      user: req.user._id,
    });
    rw.set({ assignmentWorks });
  });

  if (input.evaluation) {
    assignment.set({
      evaluations: (assignment.evaluations || [])
        .filter(e => e.user.toString() !== req.user._id)
        .concat({
          ...input.evaluation,
          user: req.user._id,
          targetUser: req.user._id,
        }),
    });
  }
  return new Promise((resolve, reject) => assignment.save(async (err, doc) => {
    if (err) {
      if (req.files && req.files.length) {
        req.files.forEach((f) => {
          fs.unlinkSync(f.path);
        });
      }
      return reject(err);
    }
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (f) => {
          const requiredWorkId = f.fieldname;
          const requiredWork = doc.requiredWork.id(requiredWorkId);
          const assignmentWork = requiredWork.assignmentWorks.find(aw => aw.user.equals(req.user._id));
          const upload = await cloudinary.v2.uploader.upload(f.path, {
            public_id: `${assignmentWork._id}/${stripExt(f.originalname)}`,
            overwrite: true,
          });
          fs.unlinkSync(f.path);
          assignmentWork.attachment.set({ url: upload.secure_url });
        }),
      );
      await doc.save();
    }
    // return resolve(newDoc);
    return resolve(Assignment.findOne({ _id: id }));
  }));
}

async function submitAssignmentSelfEvaluation(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  const evaluations = (assignment.evaluations || []).filter(e => !e.user.equals(req.user._id));
  evaluations.push({
    ...input,
    user: req.user._id,
    targetUser: req.user._id,
  });
  assignment.set({ evaluations });
  return assignment.save();
}

async function submitAssignmentEvaluation(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  const evaluations = (assignment.evaluations || []).filter(e => !e.user.equals(req.user._id));
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

async function assignUserToGroup(obj, { assignmentId, userId, number }, { req }) {
  const assignment = await Assignment.findOne({ _id: assignmentId });
  if (userId) {
    assignment.assignUserToGroup(number, { _id: userId });
  } else {
    assignment.assignUserToGroup(number, req.user);
  }
  return assignment.save();
}

module.exports.createAssignment = createAssignment;
module.exports.updateAssignment = updateAssignment;
module.exports.submitAssignmentWork = submitAssignmentWork;
module.exports.submitAssignmentSelfEvaluation = submitAssignmentSelfEvaluation;
module.exports.submitAssignmentEvaluation = submitAssignmentEvaluation;
module.exports.deleteAssignment = deleteAssignment;
module.exports.assignUserToGroup = assignUserToGroup;
