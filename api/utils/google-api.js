//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/google-api.js  
// 
//  @description Configurations for Google API OAuth2.0 Client
//  ---------------------------------------------------------

'use strict';

// Third party modules
const { google } = require('googleapis');
require('dotenv').config();

// Settings for googleOauth
const googleConfigs = {
  clientID: process.env.GOOGLE_API_CLIENT_ID,
  clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
  redirectURL: 'http://localhost:3000/oauth/callback' // Redirect URL for CLI tool after user gave permission
};

/**
 * @module googleOauth
 * @description Exported google Oauth2.0 object with client ID and client secret
 */
const googleOauth = new google.auth.OAuth2(googleConfigs.clientID, googleConfigs.clientSecret, googleConfigs.redirectURL);

// https://www.googleapis.com/auth/calendar: Read and write access to calendar
// https://www.googleapis.com/auth/calendar.events: Read and write access to events
// https://www.googleapis.com/auth/calendar.settings.readonly: Read settings
const scopes = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.settings.readonly'];

const googleOauthAuthURL = googleOauth.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

module.exports = {
  googleOauth,
  googleOauthAuthURL
};
