require('dotenv').config();

const config = {
  mongoDbUrl: process.env.MONGODB_URL || 'mongodb://localhost/mifadu',
  googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  facebookOAuthClientId: process.env.FACEBOOK_OAUTH_CLIENT_ID,
  facebookOAuthClientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
  twitterOAuthClientId: process.env.TWITTER_OAUTH_CLIENT_ID,
  twitterOAuthClientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
};

module.exports = config;
