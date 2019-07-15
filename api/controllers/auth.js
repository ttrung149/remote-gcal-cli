//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file controllers/auth.js  
// 
//  @description Controller for performing OAuth2.0 to Google
//  Calendar API
//  ---------------------------------------------------------

'use strict'

// Third party module
require('dotenv').config();

// API Modules
const googleConfig = require('../utils/google-api');
const { send200Respond, send400Error, send403Error } = require('../utils/messages');
const gcalroutes = require('../utils/google-calendar-routes');

const HTTP = require('../utils/http');

// Returns Google API Auth URL to CLI client
function getGoogleAPIAuthUrl(req, res) {
  if (googleConfig.googleOauthAuthURL) {
    send200Respond(res, {
      url: googleConfig.googleOauthAuthURL
    });
  }
  else {
    send400Error(res, {
      message: 'Failed to fetch Google OAuth URL'
    });
  }
}

// Validates authorization Token from Google API using the code
// attained after CLI client finished granting permissions
async function validateAuthTokenFromCode(req, res) {
  const code = req.query.code;

  try {
    const authToken = await googleConfig.googleOauth.getToken(code);
    googleConfig.googleOauth.setCredentials(authToken);

    const http = new HTTP();
    http.setAuthorizationHeader('get', authToken.tokens.access_token);

    await http.get(gcalroutes.settings);

    send200Respond(res, {
      token: authToken,
      message: 'Google account authenticated successfully'
    });
  }
  catch (err) {
    send403Error(res, 'Failed to authenticate Google account');
  }
}

module.exports = {
  getGoogleAPIAuthUrl,
  validateAuthTokenFromCode
};