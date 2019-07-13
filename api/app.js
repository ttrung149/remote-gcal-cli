//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file app.js  
// 
//  @description Root application of the gcal-wrapper API.
//  This file configures settings, routes, and
//  error handling for the main application
//  ---------------------------------------------------------

// Third party modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// API modules
const ErrorMiddleware = require('./middlewares/errors');

require('dotenv').config();

// Initialized Express app
const app = express();

// Use third party modules
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use debugging tools when running local
if (process.env.NODE_ENV === 'local') {
    app.use(morgan('dev'));
}

// Error handling when content is not reached or error is thrown in routes
app.use(ErrorMiddleware.NotFound);
app.use(ErrorMiddleware.ServerError);

module.exports = app;