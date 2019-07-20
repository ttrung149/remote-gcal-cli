//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file src/index.js
// 
//  @description Main src file for CLI tool
//  ---------------------------------------------------------

'use strict';

// Third party modules
const cli = require('commander');
require('colors');

// CLI modules
const { version } = require('../package.json');
const { authenticate, logout } = require('./auth');
const { getListOfCalendars } = require('./calendars');

// CLI init
cli
  .version(version, '-v, --version');

// Auth commands
cli
  .command('auth')
  .description('Grant CLI access to Google Account'.cyan.underline)
  .option('--logout', 'Delete Google credentials for CLI tool'.yellow)
  .action((option) => {
    if (option.logout) {
      logout();
    }
    else {
      authenticate();
    }
  });

/** Calendar commands */
// Get calendar
cli
  .command('get-calendar [id]')
  .description('Get all calendars or specific calendar with provided ID'.cyan.underline)
  .option('--table', 'View as table'.green)
  .action((id, option) => {
    if (id) {
    }
    else {
      if (option.table) {
        getListOfCalendars('table');
      }
      else {
        getListOfCalendars('list');
      }
    }
  });
cli.parse(process.argv);
