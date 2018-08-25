const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    idNumber: String,
    email: String,
    googleId: String,
    facebookId: String,
    twitterId: String,
    password: String,
    receiveNews: { type: Boolean, default: false },
    acceptedTerms: { type: Boolean, default: false },
    completedProfile: { type: Boolean, default: false },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop' },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    previouslyOnThisChair: Boolean,
    previousYearOnThisChair: String,
    website: String,
    aboutMe: String,
    admin: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.pre('save', function save(next) {
  if (!this.isModified('password')) return next();

  if (this.password === '') {
    this.password = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 8);
  }

  return bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
    if (saltErr) return next(saltErr);

    return bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      return next();
    });
  });
});

userSchema.methods.validPassword = function validPassword(password, done) {
  bcrypt.compare(password, this.password, (err, res) => {
    done(err, res);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
