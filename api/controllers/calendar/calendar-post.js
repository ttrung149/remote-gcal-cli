//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file controllers/calendar/calendar-post.js  
// 
//  @description Controller for posting data to Google Calendar
//  API -- calendar POST end routes
//  ---------------------------------------------------------

'use strict';

// API Modules
const { send200Respond, send400Error, send401Error } = require('../../utils/messages');

const { calendar } = require('../../utils/google-calendar-routes');
const { getValidatedAuthHeader } = require('../../utils/validator');
const { createCalendarSchema } = require('../../schemas/calendar-schemas');
const HTTP = require('../../utils/http');

/**
 * @description create new Calendar with provided inputs
 * @param {*} req 
 * @param {*} res 
 */
async function createNewCalendar(req, res) {
  try {
    const http = new HTTP();
    // Validate headers
    const authHeader = getValidatedAuthHeader(req);
    if (authHeader) {
      http.setAuthorizationHeader('post', authHeader);
    }
    else {
      throw new Error('Invalid authorization header');
    }

    // request body
    const body = {
      summary: req.body.summary,
      description: req.body.description,
      timeZone: req.body.timezone,
      location: req.body.location
    };

    // validate request body
    const { error, value } = createCalendarSchema.validate(body);
    if (error) {
      throw new Error(error.message);
    }

    const { data } = await http.post(calendar.create, value);
    send200Respond(res, {
      message: `Calendar "${data.summary}" was created successfully!`,
      data: data
    });
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      send401Error(res, 'Invalid credentials');
    }
    else {
      send400Error(res, 'Failed to create calendar. Check provided arguments!');
    }
  }
}

module.exports = {
  createNewCalendar
};
