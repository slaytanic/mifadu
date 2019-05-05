const mongoose = require('mongoose');

const { Schema } = mongoose;

const workshopSchema = new Schema(
  {
    name: String,
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    tutors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    year: Number,
  },
  { timestamps: true },
);

workshopSchema.methods.isTutor = function isTutor(userId) {
  return this.tutors.includes(userId);
};

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
