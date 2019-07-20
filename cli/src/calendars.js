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
// const path = require('path');
// const ora = require('ora');
const Table = require('cli-table3');

// CLI modules
const HTTP = require('../utils/http');
const {
  getTokenFromKeyChain
} = require('../utils/cli-utils');

const http = new HTTP();
http.setBaseURL('http://localhost:8000');

/**
 * @description get all calendars owned by authorized user
 * @param {*} view (--list | --table) 
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
    if (view === 'table') {
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
      console.log('\nList of calendars:'.cyan);
      data.forEach(calendar => {
        console.log('-'.repeat(60));
        for (const key in calendar) {
          console.log(`${key}:`.green, calendar[key]);
        }
      });
      console.log('\n');
    }
  }
  catch (err) {
    if (err.message === 'Request failed with status code 401') {
      console.log('Invalid credentials. Try `gcal-cli auth`!'.yellow);
    }
    console.log('Failed to get calendar. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  getListOfCalendars
};
