//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file controllers/calendar/calendar-get.js  
// 
//  @description Controller for updating data to Google Calendar 
//  API -- calendars PUT end routes
//  ---------------------------------------------------------

'use strict';

// API Modules
const { send200Respond, send400Error, send401Error } = require('../../utils/messages');

const { calendar } = require('../../utils/google-calendar-routes');
const { getValidatedAuthHeader } = require('../../utils/validator');
const { updateCalendarSchema } = require('../../schemas/calendar-schemas');
const HTTP = require('../../utils/http');

/**
 * @description update existing calendar with provided inputs
 * @param {*} req 
 * @param {*} res 
 */
async function updateExistingCalendar(req, res) {
  try {
    const http = new HTTP();
    // Validate headers
    const authHeader = getValidatedAuthHeader(req);
    if (authHeader) {
      http.setAuthorizationHeader('put', authHeader);
    }
    else {
      throw new Error('Invalid authorization header');
    }

    // request body
    const body = {
      id: req.body.id,
      summary: req.body.summary,
      description: req.body.description,
      timezone: req.body.timezone,
      location: req.body.location
    };

    // validate request body
    const { error, value } = updateCalendarSchema.validate(body);
    if (error) {
      throw new Error(error.message);
    }

    const { data } = await http.put(`${calendar.put}/${req.body.id}`, value);
    send200Respond(res, {
      message: `Calendar "${data.summary}" was updated successfully!`,
      data: data
    });
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      send401Error(res, 'Invalid credentials');
    }
    else {
      send400Error(res, 'Failed to update calendar. Check provided arguments!');
    }
  }
}

module.exports = {
  updateExistingCalendar
};
