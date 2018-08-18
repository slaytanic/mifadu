const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileSchema = new Schema({
  name: String,
  type: String,
  url: String,
});

module.exports = fileSchema;
