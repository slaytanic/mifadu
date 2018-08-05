const mongoose = require('mongoose');

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: String,
    code: String,
  },
  { timestamps: true },
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
