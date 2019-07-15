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
const qs = require('querystring');

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
    // get auth access token from google Oauth service
    const authToken = await googleConfig.googleOauth.getToken(code);
    googleConfig.googleOauth.setCredentials(authToken);

    // verify that the access token is valid
    const http = new HTTP();
    http.setAuthorizationHeader('get', authToken.tokens.access_token);

    await http.get(gcalroutes.settings);

    send200Respond(res, {
      token: authToken.tokens,
      message: 'Google account authenticated successfully'
    });
  }
  catch (err) {
    send403Error(res, 'Failed to authenticate Google account');
  }
}

// Get new access token from refresh token
async function getAuthTokenFromRefreshToken(req, res) {
  const payload = {
    client_id: process.env.GOOGLE_API_CLIENT_ID,
    client_secret: process.env.GOOGLE_API_CLIENT_SECRET,
    refresh_token: req.body.refreshToken,
    grant_type: 'refresh_token'
  };

  try {
    // Calls Google token API to obtain new auth access token
    const http = new HTTP();
    http.setBaseURL(gcalroutes.refreshTokenURL);
    http.setHttpHeader('post', 'Content-Type', 'application/x-www-form-urlencoded');

    const tokens = await http.post('', qs.stringify(payload));

    send200Respond(res, {
      message: 'New access token is retrieved',
      data: tokens.data
    });
  }
  catch (err) {
    send403Error(res, 'Failed to get new access token from refresh token');
  }
}

module.exports = {
  getGoogleAPIAuthUrl,
  validateAuthTokenFromCode,
  getAuthTokenFromRefreshToken
};