const Avatar = require('../../models/avatar');
const cloudinary = require('../../cloudinary');

async function createAvatar(obj, { file }) {
  const {
    createReadStream, filename, mimetype, encoding,
  } = await file;
  const stream = createReadStream();

  return new Promise((resolve, reject) => stream.pipe(
    cloudinary.v2.uploader.upload_stream((uploadErr, uploadRes) => {
      if (uploadErr) {
        console.error(uploadErr);
        return reject(uploadErr);
      }
      const avatar = new Avatar({
        filename,
        mimetype,
        encoding,
        publicId: uploadRes.public_id,
        url: uploadRes.url,
        secureUrl: uploadRes.secure_url,
        format: uploadRes.format,
      });
      return resolve(avatar.save());
    }),
  ));
}

function deleteAvatar(obj, { id }) {
  return Avatar.findOneAndRemove({ _id: id });
}

module.exports.createAvatar = createAvatar;
module.exports.deleteAvatar = deleteAvatar;
