const appEnv = require('cfenv').getAppEnv();
require('dotenv').config();

const config = {
  isLocal: appEnv.isLocal,
  url: appEnv.isLocal ? 'localhost:3000' : appEnv.url,
  appSecret: process.env.APP_SECRET || 'mifadu-secret',
  mongoDbUrl: process.env.MONGODB_URL || 'mongodb://localhost/mifadu',
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,
  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  facebookCallbackURL: process.env.FACEBOOK_CALLBACK_URL,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterCallbackURL: process.env.TWITTER_CALLBACK_URL,
};

module.exports = config;
