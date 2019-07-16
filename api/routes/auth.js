//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file routes/auth.js  
// 
//  @description This module contains routes to perform Oauth2.0
//  to Google Calendar API and interact with CLI client
//  ---------------------------------------------------------

'use strict';

// Third party modules
const router = require('express').Router();

// API Modules
const authController = require('../controllers/auth');

router.get('/oauthUrl', authController.getGoogleAPIAuthUrl);
router.get('/getAuthTokenFromCode', authController.getAuthTokenFromCode);
router.get('/isTokenValid', authController.isTokenValid);
router.get('/refreshToken', authController.getAuthTokenFromRefreshToken);

module.exports = router;
