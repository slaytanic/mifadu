function stripExt(filename) {
  return filename.substring(0, filename.lastIndexOf('.'));
}

module.exports = stripExt;
