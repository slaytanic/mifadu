const mongoose = require('mongoose');

const { Schema } = mongoose;

require('array.prototype.flatmap').shim();

const fileSchema = require('./fileSchema');

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
    workshop: { type: Schema.Types.ObjectId, ref: 'Tag' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

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

assignmentSchema.methods.statusTagsForUser = function statusTagsForUser(user) {
  const statusTags = [];
  if (this.requiredWork) {
    const workDelivered = this.requiredWork
      .map(rw => rw.assignmentWorks && rw.assignmentWorks.find(aw => aw.user.equals(user._id)))
      .filter(aw => aw);
    if (workDelivered.length < this.requiredWork.length) {
      statusTags.push('pending_work');
    } else {
      statusTags.push('completed_work');
    }
  }

  if (this.selfEvaluationForUser(user)) {
    statusTags.push('self_evaluation_completed');
  } else {
    statusTags.push('self_evaluation_pending');
  }

  if (this.tutorEvaluationForUser(user)) {
    statusTags.push('evaluation_completed');
  } else {
    statusTags.push('evaluation_pending');
  }

  return statusTags;
};

assignmentSchema.statics.forUser = function forUser(user) {
  return this.find({ workshop: user.workshop });
};

assignmentSchema.statics.pendingByUser = function pendingByUser(user) {
  return this.find({ workshop: user.workshop });
};

assignmentSchema.statics.completedByUser = function completedByUser(user) {
  return this.find({ workshop: user.workshop });
};

assignmentSchema.statics.pendingEvaluationByUser = function pendingEvaluationByUser(user) {
  return new Promise((resolve, reject) => {
    this.find({ workshop: user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length < 1),
      );
    });
  });
};

assignmentSchema.statics.completedEvaluationByUser = function completedEvaluationByUser(user) {
  return new Promise((resolve, reject) => {
    this.find({ workshop: user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length > 0),
      );
    });
  });
};

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
  const requiredWorkCount = this.requiredWork.length;
  const usersWithSubmittedWork = [
    ...new Set(
      this.requiredWork.flatMap(
        rw => rw.assignmentWorks && rw.assignmentWorks.map(aw => aw.user.toString()),
      ),
    ),
  ];
  return usersWithSubmittedWork
    .map((user) => {
      const submittedWorkCount = this.requiredWork
        .map(rw => rw.assignmentWorks && rw.assignmentWorks.find(aw => aw.user.equals(user)))
        .filter(i => i).length;

      if (submittedWorkCount === requiredWorkCount && this.selfEvaluationForUser({ _id: user })) {
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

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
