const mongoose = require('mongoose');

const { Schema } = mongoose;

const avatarSchema = new Schema(
  {
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, required: true },
  },
  { timestamps: true },
);

const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
