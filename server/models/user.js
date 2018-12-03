const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const config = require('../config');

const { Schema } = mongoose;

const SALT_WORK_FACTOR = 10;

const sendMail = require('../lib/sendMail');

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
    profilePicture: String,
    admin: { type: Boolean, default: true },
    recoveryToken: String,
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

userSchema.virtual('fullName').get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.recoverPassword = async function recoverPassword(email) {
  const user = await this.findOne({ email });
  if (user) {
    const recoveryToken = uuidv4();
    user.set({ recoveryToken });
    await user.save();
    const recoveryLink = `https://${config.url}/recover_password/${recoveryToken}`;
    await sendMail(
      'no-responder@mifadu.cfapps.io',
      email,
      'Recuperar Clave',
      `Para recuperar su clave haga click en el siguiente link: ${recoveryLink}`,
      `Para recuperar su clave haga <a href="${recoveryLink}">click aquí</a>`,
    );
  } else {
    await sendMail(
      'no-responder@mifadu.cfapps.io',
      email,
      'Recuperar Clave',
      `Se solicitó un cambio de clave para esta dirección de e-mail en el sitio web de MiFADU pero el usuario no existe en el sistema. Para registrarse ingrese a https://${
        config.url
      }`,
      `Se solicitó un cambio de clave para esta dirección de e-mail en el sitio web de MiFADU pero el usuario no existe en el sistema. Para registrarse ingrese a https://${
        config.url
      }`,
    );
  }
  return true;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
