const mongoose = require('mongoose');

const { Schema } = mongoose;

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

requiredWorkSchema.methods.assignmentWorkForUser = function assignmentWorkForUser(
  user,
) {
  return (
    this.assignmentWorks
    && this.assignmentWorks.find(aw => aw.user.equals(user._id))
  );
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

assignmentSchema.methods.evaluationForUser = function evaluationForUser(
  user,
  targetUser,
) {
  if (this.evaluations) {
    return this.evaluations.find(
      e => e.targetUser.equals(targetUser._id) && e.user.equals(user._id),
    );
  }
  return null;
};

assignmentSchema.methods.selfEvaluationForUser = function selfEvaluationForUser(
  user,
) {
  return this.evaluationForUser(user, user);
};

assignmentSchema.methods.statusTagsForUser = function statusTagsForUser(user) {
  const statusTags = [];
  if (this.requiredWork) {
    const workDelivered = this.requiredWork
      .map(
        rw => rw.assignmentWorks
          && rw.assignmentWorks.find(aw => aw.user.equals(user._id)),
      )
      .filter(aw => aw);
    if (workDelivered.length < this.requiredWork.length) {
      statusTags.push('pending_work');
    } else {
      statusTags.push('completed_work');
    }
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

assignmentSchema.statics.pendingEvaluationByUser = function pendingEvaluationByUser(
  user,
) {
  return new Promise((resolve, reject) => {
    this.find({ workshop: user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(
          d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length
            < 1,
        ),
      );
    });
  });
};

assignmentSchema.statics.completedEvaluationByUser = function completedEvaluationByUser(
  user,
) {
  return new Promise((resolve, reject) => {
    this.find({ workshop: user.workshop }, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(
        docs.filter(
          d => (d.evaluations || []).filter(e => e.user.equals(user._id)).length
            > 0,
        ),
      );
    });
  });
};

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
