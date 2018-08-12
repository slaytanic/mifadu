const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = require('./fileSchema');

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
  },
  { timestamps: true },
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
