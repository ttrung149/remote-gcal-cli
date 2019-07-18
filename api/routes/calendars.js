//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file routes/calendars.js  
// 
//  @description This module contains routes to perform tasks
//  regarding to calendars Google API end routes
//  ---------------------------------------------------------

'use strict';

// Third party modules
const router = require('express').Router();

// API Modules
const calendarsGetController = require('../controllers/calendar/calendar-get');

router.get('/list', calendarsGetController.getListOfCalendars);
router.get('/list/:id', calendarsGetController.getCalendarFromId);

module.exports = router;
