//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file calendar/calendar-delete.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars DELETE end routes
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
 * @description delete selected calendar
 */
async function deleteSelectedCalendar() {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    http.setAuthorizationHeader('get', accessToken);
    const calendarList = await http.get(gcalroutes.calendar.list);

    console.log('Select calendar to be deleted'.cyan);
    const selection = await cliSelect({
      values: calendarList.data.items.map(calendar => `${calendar.summary}`),
      selected: '◎'.green,
      unselected: '○'
    });

    console.log(`Deleting ${selection.value}...`);

    const calendarToDelete = calendarList.data.items[selection.id].id;

    http.setAuthorizationHeader('delete', accessToken);
    http.setHttpHeader('delete', 'Content-Type', 'application/json');

    await http.delete(`${gcalroutes.calendar.delete}/${calendarToDelete}`);
    console.log('Calendar deleted successfully!'.green);
    process.exit(0);
  }
  catch (err) {
    if (!err) process.exit(1);
    if (err.response) {
      const { error } = err.response.data;
      console.log(error.message);
    }
    else {
      console.log(err.message);
    }
    console.log('Failed to delete calendar. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  deleteSelectedCalendar
};
