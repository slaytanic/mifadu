const mongoose = require('mongoose');

const { Schema } = mongoose;

const universitySchema = new Schema(
  {
    name: String,
  },
  { timestamps: true },
);

const University = mongoose.model('University', universitySchema);

module.exports = University;
