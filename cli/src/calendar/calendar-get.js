//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file calendar/calendar-get.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- calendars GET end routes
//  ---------------------------------------------------------

// Third party modules
const path = require('path');
const Table = require('cli-table3');
const cliSelect = require('cli-select');
const fs = require('fs-extra');

// CLI modules
const HTTP = require('../../utils/http');
const {
  getTokenFromKeyChain
} = require('../../utils/cli-utils');

const gcalroutes = require('../../utils/google-api-routes');

const http = new HTTP();
http.setBaseURL(gcalroutes.baseUrl);

/**
 * @description checkout calendar from list of calendars
 */
async function checkOutCalendar() {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    http.setAuthorizationHeader('get', accessToken);
    const { data } = await http.get(gcalroutes.calendar.list);

    console.log('Select calendar'.cyan);
    const selection = await cliSelect({
      values: data.items.map(calendar => `${calendar.summary}`),
      selected: '◎'.green,
      unselected: '○'
    });

    const pathToConfigCurrentCal = path.resolve(__dirname, '..', '..', '.config', '.currentCalendar.json');
    fs.outputFileSync(pathToConfigCurrentCal, JSON.stringify(data.items[selection.id]), 'utf-8');
    console.log(`Checked out as "${selection.value}"`);
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
    console.log('Failed to checkout calendar. Try again!'.bgRed);
    process.exit(1);
  }
}

/**
 * @description get all calendars owned by authorized user
 * @param {Boolean} view (--table) 
 */
async function getListOfCalendars(view) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');

    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }
    http.setAuthorizationHeader('get', accessToken);
    const { data } = await http.get(gcalroutes.calendar.list);

    // format data received from Google API
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

    // display table
    if (view) {
      const table = new Table({
        head: ['ID', 'Summary', 'Timezone', 'Primary', 'Role'],
        colWidths: [10, 10, 10, 10, 10]
      });

      listOfCalendars.forEach(calendar => {
        table.push(Object.values(calendar));
      });
      console.log(table.toString());
    }

    // display list
    else {
      console.log('List of calendars:'.cyan);
      listOfCalendars.forEach(calendar => {
        console.log('-'.repeat(60));
        for (const key in calendar) {
          console.log(`${key}:`.green, calendar[key]);
        }
      });
      console.log('-'.repeat(60));
    }
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
    console.log('Failed to get calendar. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  checkOutCalendar,
  getListOfCalendars
};
