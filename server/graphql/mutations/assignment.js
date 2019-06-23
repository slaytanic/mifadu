const { ForbiddenError } = require('apollo-server');
const uuidv4 = require('uuid/v4');

const stripExt = require('../../lib/stripExt');
const cloudinary = require('../../cloudinary');

const Assignment = require('../../models/assignment');
const Workshop = require('../../models/workshop');

async function createAssignment(obj, { input }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

  const assignment = new Assignment({
    workshop: await Workshop.currentForUser(req.user._id),
    ...Object.keys(input).reduce(
      (acc, key) => (key !== 'attachment' ? { ...acc, [key]: input[key] } : acc),
      {},
    ),
  });
  await assignment.save();

  if (!input.attachment) return assignment;

  const { createReadStream, filename, mimetype, encoding } = await input.attachment;
  const stream = createReadStream();

  return new Promise((resolve, reject) =>
    stream.pipe(
      cloudinary.v2.uploader.upload_stream(
        {
          public_id: `${assignment._id}/${stripExt(filename)}`,
          overwrite: true,
        },
        (uploadErr, uploadRes) => {
          if (uploadErr) {
            console.error(uploadErr);
            return reject(uploadErr);
          }
          assignment.set({
            attachment: {
              filename,
              mimetype,
              encoding,
              publicId: uploadRes.public_id,
              url: uploadRes.url,
              secureUrl: uploadRes.secure_url,
              format: uploadRes.format,
            },
          });
          return resolve(assignment.save());
        },
      ),
    ),
  );
}

async function updateAssignment(obj, { id, input }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

  const assignment = await Assignment.findOne({ _id: id });
  if (!assignment) {
    return new Error('Assignment not found');
  }

  assignment.set(
    Object.keys(input).reduce((acc, key) => {
      if (key === 'attachment') {
        return acc;
      }
      if (key === 'requiredWork') {
        if (!input[key] || !input[key].length) {
          return { ...acc, [key]: [] };
        }
        const ids = input[key].map(rwInput => rwInput.id);
        assignment.requiredWork.forEach(rw => {
          if (!ids.includes(rw._id.toString())) {
            rw.remove();
          }
        });
        input[key].forEach(rw => {
          if (rw.id) {
            assignment.requiredWork.id(rw.id).set(rw);
          } else {
            assignment.requiredWork.push(rw);
          }
        });
        return acc;
      }
      return { ...acc, [key]: input[key] };
    }, {}),
  );

  await assignment.save();

  if (!input.attachment) return assignment;

  const { createReadStream, filename, mimetype, encoding } = await input.attachment;
  const stream = createReadStream();

  return new Promise((resolve, reject) =>
    stream.pipe(
      cloudinary.v2.uploader.upload_stream(
        {
          public_id: `${assignment._id}/${stripExt(filename)}`,
          overwrite: true,
        },
        (uploadErr, uploadRes) => {
          if (uploadErr) {
            console.error(uploadErr);
            return reject(uploadErr);
          }
          assignment.set({
            attachment: {
              filename,
              mimetype,
              encoding,
              publicId: uploadRes.public_id,
              url: uploadRes.url,
              secureUrl: uploadRes.secure_url,
              format: uploadRes.format,
            },
          });
          return resolve(assignment.save());
        },
      ),
    ),
  );
}

async function submitAssignmentWork(obj, { id, requiredWorkId, input }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

  const assignment = await Assignment.findOne({ _id: id });
  if (!assignment) {
    return new Error('Assignment not found');
  }

  const requiredWork = assignment.requiredWork.id(requiredWorkId);

  const assignmentWork = { user: req.user, content: input.content };

  if (input.attachment) {
    const { createReadStream, filename, mimetype, encoding } = await input.attachment;
    const stream = createReadStream();

    assignmentWork.attachment = await new Promise((resolve, reject) =>
      stream.pipe(
        cloudinary.v2.uploader.upload_stream(
          {
            public_id: `${assignment._id}/${requiredWorkId}/${req.user._id}/${uuidv4()}/${stripExt(
              filename,
            )}`,
            overwrite: true,
          },
          (uploadErr, uploadRes) => {
            if (uploadErr) {
              console.error(uploadErr);
              return reject(uploadErr);
            }
            return resolve({
              filename,
              mimetype,
              encoding,
              publicId: uploadRes.public_id,
              url: uploadRes.url,
              secureUrl: uploadRes.secure_url,
              format: uploadRes.format,
            });
          },
        ),
      ),
    );
  }

  requiredWork.assignmentWorks.push(assignmentWork);

  return assignment.save();
}

async function deleteAssignmentWork(obj, { id, requiredWorkId, assignmentWorkId }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

  const assignment = await Assignment.findOne({ _id: id });
  if (!assignment) {
    return new Error('Assignment not found');
  }

  const requiredWork = assignment.requiredWork.id(requiredWorkId);
  requiredWork.assignmentWorks.id(assignmentWorkId).remove();
  return assignment.save();
}

async function submitAssignmentSelfEvaluation(obj, { id, input }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

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

async function submitAssignmentEvaluation(obj, { id, targetUser, input }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

  const assignment = await Assignment.findOne({ _id: id });
  if (assignment === undefined) {
    return new Error('Assignment not found');
  }

  assignment.evaluations.forEach(e => {
    if (e.user.equals(req.user._id)) e.remove();
  });

  assignment.evaluations.push({
    ...input,
    user: req.user._id,
    targetUser,
  });
  return assignment.save();
}

function deleteAssignment(obj, { id }, { req }) {
  if (!req.user) throw new ForbiddenError('No permitido');

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
module.exports.deleteAssignmentWork = deleteAssignmentWork;
module.exports.assignUserToGroup = assignUserToGroup;
