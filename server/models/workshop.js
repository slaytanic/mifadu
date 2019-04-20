const mongoose = require('mongoose');

const User = require('./user');

const { Schema } = mongoose;

const workshopSchema = new Schema(
  {
    name: String,
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    tutors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

workshopSchema.methods.members = function members() {
  return User.find({
    workshops: { $elemMatch: { workshop: this._id, year: new Date().getFullYear() } },
  });
};

workshopSchema.methods.memberCount = function memberCount() {
  return this.members().count();
};

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
