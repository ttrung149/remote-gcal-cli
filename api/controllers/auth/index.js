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

const googleConfig = require('../../config/google-api');

function getGoogleAPIAuthUrl(req, res) {
  if (googleConfig.googleOauthAuthURL) {
    res.status(200).json({
      url: googleConfig.googleOauthAuthURL
    });
  }
  else {
    res.status(400).json({
      message: 'Failed to fetch Google OAuth URL'
    });
  }
}

module.exports = {
  getGoogleAPIAuthUrl
};