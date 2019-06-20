const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

const { Schema } = mongoose;

require('array.prototype.flatmap').shim();

const User = require('./user');
const fileSchema = require('./fileSchema');

const groupSchema = new Schema({
  number: Number,
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const assignmentWorkSchema = new Schema(
  {
    content: String,
    attachment: fileSchema,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const evaluationSchema = new Schema(
  {
    score1: Number,
    score2: Number,
    score3: Number,
    score4: Number,
    score5: Number,
    observations: String,
    targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

evaluationSchema.virtual('totalScore').get(function getTotalScore() {
  return this.score1 + this.score2 + this.score3 + this.score4 + this.score5;
});

evaluationSchema.virtual('finalScore').get(function getTotalScore() {
  if (Math.round(this.totalScore) === 3) {
    return 2;
  }
  return Math.round(this.totalScore);
});

const requiredWorkSchema = new Schema(
  {
    type: { type: String, enum: ['JPG', 'PDF', 'Video', 'URL'] },
    description: String,
    assignmentWorks: [assignmentWorkSchema],
  },
  {
    timestamps: true,
  },
);

requiredWorkSchema.methods.assignmentWorkForUser = function assignmentWorkForUser(user) {
  return this.assignmentWorks && this.assignmentWorks.find(aw => aw.user.equals(user._id));
};

requiredWorkSchema.methods.assignmentWorksForUser = function assignmentWorksForUser(user) {
  return this.assignmentWorks.filter(aw => aw.user.equals(user._id));
};

const assignmentSchema = new Schema(
  {
    name: String,
    shortDescription: String,
    description: String,
    type: { type: String, enum: ['Group', 'Individual'] },
    startsAt: Date,
    endsAt: Date,
    evaluationVariable: String,
    requiredWork: [requiredWorkSchema],
    attachment: fileSchema,
    evaluations: [evaluationSchema],
    groups: [groupSchema],
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

assignmentSchema.methods.assignUserToGroup = function assignUserToGroup(number, user) {
  this.groups = this.groups.map(g => ({ ...g, users: g.users.filter(u => !u.equals(user._id)) }));
  const group = this.groups.find(g => g.number === number);
  if (group) {
    group.users.push(user._id);
  } else {
    this.groups.push({ number, users: [user._id] });
  }
};

assignmentSchema.methods.groupForUser = function groupForUser(user) {
  if (this.groups) {
    return this.groups.find(g => g.users.map(u => u.toString()).includes(user._id.toString()));
  }
  return null;
};

assignmentSchema.methods.evaluationForUser = function evaluationForUser(user, targetUser) {
  if (this.evaluations) {
    return this.evaluations.find(
      e => e.targetUser.equals(targetUser._id) && e.user.equals(user._id),
    );
  }
  return null;
};

assignmentSchema.methods.selfEvaluationForUser = function selfEvaluationForUser(user) {
  return this.evaluationForUser(user, user);
};

assignmentSchema.methods.tutorEvaluationForUser = function tutorEvaluationForUser(user) {
  if (this.evaluations) {
    return this.evaluations.find(e => !e.user.equals(user._id) && e.targetUser.equals(user._id));
  }
  return null;
};

assignmentSchema.methods.statusTagsForUser = async function statusTagsForUser(user) {
  await this.populate('workshop').execPopulate();

  const statusTags = [];

  if (!this.workshop.isTutor(user) && this.requiredWork) {
    const workDelivered = this.requiredWork
      .map(rw => rw.assignmentWorks && rw.assignmentWorks.find(aw => aw.user.equals(user._id)))
      .filter(aw => aw);
    if (!workDelivered.length) {
      statusTags.push('pending_work');
    } else {
      statusTags.push('completed_work');

      if (this.selfEvaluationForUser(user)) {
        statusTags.push('self_evaluation_completed');

        if (this.tutorEvaluationForUser(user)) {
          statusTags.push('evaluation_completed');
        } else {
          statusTags.push('evaluation_pending');
        }
      } else {
        statusTags.push('self_evaluation_pending');
      }
    }
  }

  return statusTags;
};

// assignmentSchema.statics.forUser = function forUser(user) {
//   return this.find({ workshop: user.workshop });
// };

// assignmentSchema.statics.pendingByUser = function pendingByUser(user) {
//   return this.find({ workshop: user.workshop });
// };

// assignmentSchema.statics.completedByUser = function completedByUser(user) {
//   return this.find({ workshop: user.workshop });
// };

// assignmentSchema.statics.pendingEvaluationByUser = function pendingEvaluationByUser(user) {
//   return new Promise((resolve, reject) => {
//     this.find({ workshop: user.workshop }, (err, docs) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(
//         docs.filter(d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length < 1),
//       );
//     });
//   });
// };

// assignmentSchema.statics.completedEvaluationByUser = function completedEvaluationByUser(user) {
//   return new Promise((resolve, reject) => {
//     this.find({ workshop: user.workshop }, (err, docs) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(
//         docs.filter(d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length > 0),
//       );
//     });
//   });
// };

assignmentSchema.virtual('completedWorksCount').get(function getCompletedWorksCount() {
  return this.completedBy.length;
});

assignmentSchema.virtual('evaluatedWorksCount').get(function getEvaluatedWorksCount() {
  return this.usersWithEvaluations.length;
});

assignmentSchema
  .virtual('pendingEvaluationWorksCount')
  .get(function getPendingEvaluationWorksCount() {
    return this.completedWorksCount - this.evaluatedWorksCount;
  });

assignmentSchema.virtual('completedBy').get(function getCompletedBy() {
  // const requiredWorkCount = this.requiredWork.length;
  const usersWithSubmittedWork = [
    ...new Set(
      this.requiredWork.flatMap(
        rw => rw.assignmentWorks && rw.assignmentWorks.map(aw => aw.user.toString()),
      ),
    ),
  ];
  return usersWithSubmittedWork
    .map(user => {
      const submittedWorkCount = this.requiredWork
        .map(rw => rw.assignmentWorks && rw.assignmentWorks.find(aw => aw.user.equals(user)))
        .filter(i => i).length;

      // if (submittedWorkCount === requiredWorkCount && this.selfEvaluationForUser({ _id: user })) {
      if (submittedWorkCount > 0 && this.selfEvaluationForUser({ _id: user })) {
        return user;
      }
      return null;
    })
    .filter(i => i);
});

assignmentSchema.virtual('usersWithoutEvaluations').get(function getUsersWithoutEvaluations() {
  if (this.evaluations) {
    return this.completedBy.filter(user => !this.usersWithEvaluations.includes(user.toString()));
  }
  return this.completedBy;
});

assignmentSchema.virtual('usersWithEvaluations').get(function getUsersWithEvaluations() {
  if (this.evaluations) {
    return this.evaluations
      .filter(e => !e.targetUser.equals(e.user))
      .map(e => e.targetUser.toString());
  }
  return [];
});

assignmentSchema.methods.linksForUser = function linksForUser(user) {
  return this.requiredWork.map(rw => {
    const assignmentWork = rw.assignmentWorks.find(aw => aw.user.equals(user._id));
    if (assignmentWork) {
      if (assignmentWork.content && assignmentWork.content.length) {
        return assignmentWork.content;
      }
      return assignmentWork.attachment && assignmentWork.attachment.url;
    }
    return 'N/A';
  });
};

assignmentSchema.methods.exportEvaluations = async function exportEvaluations() {
  const workbook = new ExcelJS.Workbook();
  // await workbook.xlsx.readFile(path.join(__dirname, '../data/export.xlsx'));
  // const worksheet = workbook.getWorksheet('Notas');
  const worksheet = workbook.addWorksheet('Notas');
  const users = {};
  await Promise.all(
    this.evaluations.map(async e => {
      if (!Object.keys(users).includes(e.targetUser.toString())) {
        users[e.targetUser.toString()] = await User.findOne({ _id: e.targetUser.toString() });
      }
    }),
  );
  worksheet.addRow([
    '',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
    'Alumno',
    'Docente',
  ]);
  worksheet.addRow([
    'Alumno',
    'Propuesta Conceptual',
    'Propuesta Conceptual',
    'Proceso',
    'Proceso',
    this.evaluationVariable,
    this.evaluationVariable,
    'Producto',
    'Producto',
    'Comunicación',
    'Comunicación',
    'Suma',
    'Suma',
    'Final',
    'Final',
    'Observaciones',
    'Observaciones',
    'Links',
  ]);
  Object.keys(users).forEach(key => {
    const user = users[key];
    let selfEvaluationForUser = this.selfEvaluationForUser(user);
    if (!selfEvaluationForUser) {
      selfEvaluationForUser = {
        score1: '-',
        score2: '-',
        score3: '-',
        score4: '-',
        score5: '-',
        totalScore: '-',
        finalScore: '-',
      };
    }
    let tutorEvaluationForUser = this.tutorEvaluationForUser(user);
    if (!tutorEvaluationForUser) {
      tutorEvaluationForUser = {
        score1: '-',
        score2: '-',
        score3: '-',
        score4: '-',
        score5: '-',
        totalScore: '-',
        finalScore: '-',
      };
    }
    worksheet.addRow(
      [
        user.fullName,
        selfEvaluationForUser.score1,
        tutorEvaluationForUser.score1,
        selfEvaluationForUser.score2,
        tutorEvaluationForUser.score2,
        selfEvaluationForUser.score3,
        tutorEvaluationForUser.score3,
        selfEvaluationForUser.score4,
        tutorEvaluationForUser.score4,
        selfEvaluationForUser.score5,
        tutorEvaluationForUser.score5,
        selfEvaluationForUser.totalScore,
        tutorEvaluationForUser.totalScore,
        selfEvaluationForUser.finalScore,
        tutorEvaluationForUser.finalScore,
        selfEvaluationForUser.observations,
        tutorEvaluationForUser.observations,
      ].concat(this.linksForUser(user)),
    );
  });
  return workbook;
};

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
