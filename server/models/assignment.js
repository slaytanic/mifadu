const mongoose = require('mongoose');

const { Schema } = mongoose;

const assignmentSchema = new Schema(
  {
    name: String,
    shortDescription: String,
    description: String,
    type: { type: String, enum: ['Group', 'Individual'] },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
