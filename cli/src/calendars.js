//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file src/calendars.js
// 
//  @description Make HTTP call to wrapper server to obtain
//  data regarding the calendars on authenticated Google Account
//  ---------------------------------------------------------

'use strict';

// Third party modules
const path = require('path');
const Table = require('cli-table3');
const cliSelect = require('cli-select');
const fs = require('fs-extra');

// CLI modules
const HTTP = require('../utils/http');
const {
  localBaseUrl,
  prodBaseUrl,
  getTokenFromKeyChain
} = require('../utils/cli-utils');

const http = new HTTP();

if (process.env.NODE_ENV === 'local') {
  http.setBaseURL(localBaseUrl);
}
else if (process.env.NODE_ENV === 'production') {
  http.setBaseURL(prodBaseUrl);
}

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
    const { data } = await http.get('/api/calendars/list');

    console.log('Select calendar'.cyan);
    const selection = await cliSelect({
      values: data.map(calendar => `${calendar.summary}`),
      selected: '◎'.green,
      unselected: '○'
    });

    const pathToConfigCurrentCal = path.resolve(__dirname, '..', '.config', '.currentCalendar.json');
    fs.outputFileSync(pathToConfigCurrentCal, JSON.stringify(data[selection.id]), 'utf-8');
    console.log(`Checked out as ${selection.value}`);
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      console.log('Invalid credentials. Try `gcal-cli auth`!'.yellow);
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
    const { data } = await http.get('/api/calendars/list');

    // display table
    if (view) {
      const table = new Table({
        head: ['ID', 'Summary', 'Timezone', 'Primary', 'Role'],
        colWidths: [10, 10, 10, 10, 10]
      });

      data.forEach(calendar => {
        table.push(Object.values(calendar));
      });
      console.log(table.toString());
    }

    // display list
    else {
      console.log('List of calendars:'.cyan);
      data.forEach(calendar => {
        console.log('-'.repeat(60));
        for (const key in calendar) {
          console.log(`${key}:`.green, calendar[key]);
        }
      });
      console.log('-'.repeat(60));
    }
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      console.log('Invalid credentials. Try `gcal-cli auth`!'.yellow);
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
