const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    idNumber: String,
    acceptedTerms: Boolean,
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
