//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file calendar/calendar-post.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars POST end routes
//  ---------------------------------------------------------

'use strict';

// CLI modules
const HTTP = require('../../utils/http');
const {
  getTokenFromKeyChain
} = require('../../utils/cli-utils');

const gcalroutes = require('../../utils/google-api-routes');

const http = new HTTP();
http.setBaseURL(gcalroutes.baseUrl);

/**
 * @description create new calendar
 * @param {Object} calendar
 */
async function createNewCalendar(calendar) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');

    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }
    http.setAuthorizationHeader('post', accessToken);

    const { data } = await http.post(gcalroutes.calendar.create, calendar);
    console.log(`Calendar "${data.summary}" was created successfully!`.green);
    process.exit(0);
  }
  catch (err) {
    if (err.response) {
      const { error } = err.response.data;
      console.log(error.message);
    }
    else {
      console.log(err.message);
    }
    console.log('Failed to create new calendar. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  createNewCalendar
};
