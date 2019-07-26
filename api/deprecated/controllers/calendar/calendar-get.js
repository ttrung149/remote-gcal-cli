//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  DEPRECATED
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file controllers/calendar/calendar-get.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars GET end routes
//  ---------------------------------------------------------

'use strict';

// API Modules
const { send200Respond, send400Error, send401Error } = require('../../utils/messages');

const { calendar } = require('../../utils/google-calendar-routes');
const { getValidatedAuthHeader } = require('../../utils/validator');
const HTTP = require('../../utils/http');

/**
 * @description Get list of calendars using auth user's credentials
 * @param {*} req 
 * @param {*} res 
 */
async function getListOfCalendars(req, res) {
  try {
    const http = new HTTP();

    // Validate headers
    const authHeader = getValidatedAuthHeader(req);
    if (authHeader) {
      http.setAuthorizationHeader('get', authHeader);
    }
    else {
      throw new Error('Invalid authorization header');
    }

    // Retrieve data from Google API Calendars/List route
    const { data } = await http.get(calendar.list);

    const listOfCalendars = [];
    data.items.forEach(calendar => {
      const cal = {
        id: calendar.id,
        summary: calendar.summary,
        timezone: calendar.timeZone,
        primary: calendar.primary || false,
        role: calendar.accessRole
      };
      listOfCalendars.push(cal);
    });

    // Send response of list of calendars
    send200Respond(res, listOfCalendars);
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      send401Error(res, 'Invalid credentials');
    }
    else {
      send400Error(res, err.message);
    }
  }
}

/**
 * @description Get specific calendar using auth user's credentials
 * and passed in calendar ID
 * @param {*} req 
 * @param {*} res 
 */
async function getCalendarFromId(req, res) {
  try {
    const http = new HTTP();
    const calendarId = req.params.id;

    // Validate headers
    const authHeader = getValidatedAuthHeader(req);
    if (authHeader) {
      http.setAuthorizationHeader('get', authHeader);
    }
    else {
      throw new Error('Invalid authorization header');
    }

    const { data } = await http.get(`${calendar.list}/${calendarId}`);
    const cal = {
      id: data.id,
      summary: data.summary,
      timezone: data.timeZone,
      primary: data.primary || false,
      role: data.accessRole
    };

    send200Respond(res, cal);
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      send401Error(res, 'Invalid credentials');
    }
    else {
      send400Error(res, err.message);
    }
  }
}

module.exports = {
  getListOfCalendars,
  getCalendarFromId
};
