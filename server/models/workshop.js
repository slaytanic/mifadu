const mongoose = require('mongoose');

const { Schema } = mongoose;

const workshopSchema = new Schema(
  {
    name: String,
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    tutors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
