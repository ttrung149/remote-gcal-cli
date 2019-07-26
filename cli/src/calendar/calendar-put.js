//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file calendar/calendar-put.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars PUT end routes
//  ---------------------------------------------------------

'use strict';

// Third party modules
const cliSelect = require('cli-select');

// CLI modules
const HTTP = require('../../utils/http');
const {
  getTokenFromKeyChain
} = require('../../utils/cli-utils');

const gcalroutes = require('../../utils/google-api-routes');

const http = new HTTP();
http.setBaseURL(gcalroutes.baseUrl);

/**
 * @description update selected calendar
 * @param {Object} calendar
 */
async function updateSelectedCalendar(calendar) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    http.setAuthorizationHeader('get', accessToken);
    const calendarList = await http.get(gcalroutes.calendar.list);

    console.log('Select calendar'.cyan);
    const selection = await cliSelect({
      values: calendarList.data.items.map(calendar => `${calendar.summary}`),
      selected: '◎'.green,
      unselected: '○'
    });

    console.log(`Updating ${selection.value}...`);

    calendar.id = calendarList.data.items[selection.id].id;
    if (!calendar.summary) {
      calendar.summary = calendarList.data.items[selection.id].summary;
    }

    http.setAuthorizationHeader('put', accessToken);
    await http.put(`${gcalroutes.calendar.put}/${calendar.id}`, calendar);
    console.log('Calendar updated successfully'.green);
    process.exit(0);
  }
  catch (err) {
    if (!err) process.exit(1);
    else if (err.response.data) {
      const { error } = err.response.data;
      console.log(error.message);
      console.log('Failed to update calendar. Try again!'.bgRed);
      process.exit(1);
    }
  }
}

module.exports = {
  updateSelectedCalendar
};
