const fs = require('fs');

const cloudinary = require('../../cloudinary');

const Assignment = require('../../models/assignment');

function createAssignment(obj, { input }, { req }) {
  if (req.files && req.files.attachment) {
    return new Promise((resolve, reject) => {
      const assignment = new Assignment(input);
      assignment.save((err, doc) => {
        if (err) {
          fs.unlink(req.files.attachment[0].path);
          return reject(err);
        }
        return cloudinary.v2.uploader.upload(
          req.files.attachment[0].path,
          {
            public_id: `${doc.attachment._id}/${doc.attachment.name.substring(
              0,
              doc.attachment.name.lastIndexOf('.'),
            )}`,
            overwrite: true,
          },
          (uploadErr, uploadRes) => {
            if (uploadErr) {
              return reject(uploadErr);
            }
            fs.unlink(req.files.attachment[0].path);
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
    assignment.set({ input });
    if (!req.files || !req.files.attachment) {
      return resolve(assignment.save());
    }
    return assignment.save((err, doc) => {
      if (err) {
        fs.unlink(req.files.attachment[0].path);
        return reject(err);
      }
      return cloudinary.v2.uploader.upload(
        req.files.attachment[0].path,
        {
          public_id: `${doc.attachment._id}/${doc.attachment.name.substring(
            0,
            doc.attachment.name.lastIndexOf('.'),
          )}`,
          overwrite: true,
        },
        (uploadErr, uploadRes) => {
          if (uploadErr) {
            return reject(uploadErr);
          }
          fs.unlink(req.files.attachment[0].path);
          assignment.attachment.set({ url: uploadRes.secure_url });
          return resolve(assignment.save());
        },
      );
    });
  });
}

async function updateAssignmentWork(obj, { id, input }, { req }) {
  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }
  // const assignmentWork = { ...input, user: req.user._id };
}

function deleteAssignment(obj, { id }) {
  return Assignment.findOneAndRemove({ _id: id });
}

module.exports.createAssignment = createAssignment;
module.exports.updateAssignment = updateAssignment;
module.exports.updateAssignmentWork = updateAssignmentWork;
module.exports.deleteAssignment = deleteAssignment;
