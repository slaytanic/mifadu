const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
  name: String,
  type: String,
  url: String,
});

fileSchema.virtual('cloudName').get(function getCloudName() {
  if (this.url) return 'mifadu';
  return null;
});

fileSchema.virtual('publicId').get(function getPublicId() {
  if (this.url) {
    const parts = this.url.split('/');
    const publicIdWithExtension = parts.splice(7, parts.length - 7).join('/');
    return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
  }
  return null;
});

module.exports = fileSchema;
