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
const { checkOutCalendar, getListOfCalendars } = require('./calendars');

// CLI init
cli
  .version(version, '-v, --version');

// Auth commands
cli
  .command('auth')
  .description('Grant CLI access to Google Account'.green)
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
// Switch between calendar
cli
  .command('checkout')
  .description('Checkout calendar to operate'.cyan)
  .action((option) => {
    checkOutCalendar();
  });

// Get calendar
cli
  .command('get-calendar')
  .description('Get all calendars'.cyan)
  .option('--current', 'Get current calendar information')
  .option('--table', 'View as table')
  .action((option) => {
    getListOfCalendars(option.table);
  });

cli.parse(process.argv);
