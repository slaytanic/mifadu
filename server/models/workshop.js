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

workshopSchema.methods.isTutor = function isTutor(user) {
  return this.tutors.includes(user._id);
};

workshopSchema.statics.currentForUser = function currentForUser(user) {
  return this.findOne({ tutors: user, year: new Date().getFullYear() });
};

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
