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

// Third party modules
const router = require('express').Router();

// API Modules
const authController = require('../controllers/auth/index');

router.get('/oauthUrl', authController.getGoogleAPIAuthUrl);

module.exports = router;