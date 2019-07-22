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

'use strict';

// Third party module
require('dotenv').config();
const qs = require('querystring');

// API Modules
const googleConfig = require('../utils/google-api');
const { send200Respond, send400Error, send403Error } = require('../utils/messages');
const gcalroutes = require('../utils/google-calendar-routes');
const { accessCodeSchema, accessTokenSchema, refreshTokenSchema } = require('../schemas/auth-schemas');
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

// Get authorization tokens from Google API using the code
// attained after CLI client finished granting permissions
async function getAuthTokenFromCode(req, res) {
  try {
    // validate access code before exchange code for token
    const { error, value } = accessCodeSchema.validate({ code: req.body.code });
    if (error) {
      throw new Error(error.message);
    }

    // get auth access token from google Oauth service
    const authToken = await googleConfig.googleOauth.getToken(value.code);
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

// Validates access token
async function isTokenValid(req, res) {
  try {
    // validate access token before exchange code for token
    const { error, value } = accessTokenSchema.validate({ access_token: req.body.access_token });
    if (error) {
      throw new Error(error.message);
    }
    // verify that the access token is valid
    const http = new HTTP();
    http.setAuthorizationHeader('get', value.access_token);

    await http.get(gcalroutes.settings);
    send200Respond(res, 'valid_token');
  }
  catch (err) {
    send200Respond(res, 'invalid_token');
  }
}

// Get new access token from refresh token
async function getAuthTokenFromRefreshToken(req, res) {
  try {
    // validate refresh token before exchange code for token
    const { error, value } = refreshTokenSchema.validate({ refresh_token: req.body.refresh_token });
    if (error) {
      throw new Error(error.message);
    }

    const payload = {
      client_id: process.env.GOOGLE_API_CLIENT_ID,
      client_secret: process.env.GOOGLE_API_CLIENT_SECRET,
      refresh_token: value.refresh_token,
      grant_type: 'refresh_token'
    };

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
    send200Respond(res, 'invalid_refresh_token');
  }
}

module.exports = {
  getGoogleAPIAuthUrl,
  getAuthTokenFromCode,
  isTokenValid,
  getAuthTokenFromRefreshToken
};
