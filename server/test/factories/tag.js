const Tag = require('../../models/tag');

async function testTag() {
  let tag = await Tag.findOne({ name: 'Test' });
  if (!tag) {
    tag = Tag.create({ name: 'Test' });
  }
  return tag;
}

module.exports.testTag = testTag;
