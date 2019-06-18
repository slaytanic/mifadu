const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  encoding: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  format: { type: String, required: true },
});

fileSchema.virtual('cloudName').get(function getCloudName() {
  if (this.url) return 'mifadu';
  return null;
});

module.exports = fileSchema;
