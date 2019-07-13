/**
 * gcal-wrapper-api
 * ---------------------------------------------------------
 * @copyright MIT License. Copyright (c) 2019 - Trung Truong
 * 
 * @file app.js  
 * 
 * @description Root application of the gcal-wrapper API.
 * This file configures settings, controllers, and
 * error handling for the main application
 */

// API modules

// Third party modules
const express = require('express');
const morgan = require('morgan');

require('dotenv').config();

/**
 * @description Initialized Express app
 */
const app = express();

app.use(express.json());

// Use debugging tools when running local
if (process.env.NODE_ENV === 'local') {
    app.use(morgan('dev'));
}

module.exports = app;