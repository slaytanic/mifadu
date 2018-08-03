const mongoose = require('mongoose');

const { Schema } = mongoose;

const chairSchema = new Schema(
  {
    name: String,
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    academicUnit: { type: Schema.Types.ObjectId, ref: 'AcademicUnit' },
    university: { type: Schema.Types.ObjectId, ref: 'University' },
    tutors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const Chair = mongoose.model('Chair', chairSchema);

module.exports = Chair;
