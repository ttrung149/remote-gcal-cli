//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  DEPRECATED
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file controllers/calendar/calendar-delete.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars delete end routes
//  ---------------------------------------------------------

'use strict';

// API Modules
const { send200Respond, send400Error, send401Error } = require('../../../utils/messages');

const { calendar } = require('../../../utils/google-calendar-routes');
const { getValidatedAuthHeader } = require('../../../utils/validator');
const { deleteCalendarSchema } = require('../../schemas/calendar-schemas');
const HTTP = require('../../../utils/http');

/**
 * @description Delete calendar based on provided calendar ID
 * @param {*} req 
 * @param {*} res 
 */
async function deleteCalendar(req, res) {
  try {
    const http = new HTTP();
    // Validate headers
    const authHeader = getValidatedAuthHeader(req);
    if (authHeader) {
      http.setAuthorizationHeader('delete', authHeader);
    }
    else {
      throw new Error('Invalid authorization header');
    }

    // validate request body
    const { error, value } = deleteCalendarSchema.validate({ id: req.body.id });
    if (error) {
      throw new Error(error.message);
    }

    // Retrieve data from Google API Calendars/delete route
    await http.delete(`${calendar.delete}/${value.id}`);
    send200Respond(res, 'Calendar was deleted successfully!');
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      send401Error(res, 'Invalid credentials');
    }
    else if (err.message === 'Request failed with status code 404') {
      send401Error(res, 'Calendar not found');
    }
    else {
      send400Error(res, err.message);
    }
  }
}

module.exports = {
  deleteCalendar
};
