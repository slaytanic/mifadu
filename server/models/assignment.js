const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = require('./fileSchema');

const assignmentWork = new Schema(
  {
    attachment: fileSchema,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const assignmentSchema = new Schema(
  {
    name: String,
    shortDescription: String,
    description: String,
    type: { type: String, enum: ['Group', 'Individual'] },
    startsAt: Date,
    endsAt: Date,
    attachment: fileSchema,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    works: [assignmentWork],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
