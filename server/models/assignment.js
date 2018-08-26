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
    assignmentWork: [assignmentWorkSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    // toObject: { getters: true },
  },
);

requiredWorkSchema.virtual('assignmentWorks').get(function assignmentWorks() {
  return this.assignmentWork;
});

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
