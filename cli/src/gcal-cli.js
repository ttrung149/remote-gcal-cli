#!/usr/bin/env node
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
const { checkOutCalendar, getListOfCalendars } = require('./calendar/calendar-get');
const { createNewCalendar } = require('./calendar/calendar-post');
const { updateSelectedCalendar } = require('./calendar/calendar-put');
const { deleteSelectedCalendar } = require('./calendar/calendar-delete');

// CLI init
cli
  .version(version, '-v, --version');

// Auth commands
cli
  .command('auth')
  .description('Grant CLI access to Google Account'.green)
  .option('--logout', 'Delete Google credentials for CLI tool'.yellow)
  .action((option) => {
    try {
      if (option.logout) logout();
      else authenticate();
    }
    catch (err) {
      process.exit(1);
    }
  });

/** Calendar commands */
// Switch between calendar
cli
  .command('checkout')
  .description('Checkout calendar to operate'.magenta)
  .action(async () => {
    try {
      await checkOutCalendar();
    }
    catch (err) {
      process.exit(1);
    }
  });

// Get calendar
cli
  .command('get-calendar')
  .description('Get all calendars'.cyan)
  .option('--current', 'Get current calendar information')
  .option('--table', 'View as table')
  .action(async (option) => {
    try {
      await getListOfCalendars(option.table);
    }
    catch (err) {
      process.exit(1);
    }
  });

// Create calendar
cli
  .command('create-calendar')
  .description('Create new calendar'.cyan)
  .option('--summary <summary>', 'Headline of new calendar (required)')
  .option('--description [description]', 'Description of new calendar')
  .option('--timezone [timezone]', 'Timezone of new calendar (IANA tz format)')
  .option('--location [location]', 'Location of new calendar')
  .action((options) => {
    try {
      createNewCalendar({
        summary: options.summary,
        description: options.description,
        timeZone: options.timezone,
        location: options.location
      });
    }
    catch (err) {
      process.exit(1);
    }
  });

// Update calendar
cli
  .command('update-calendar')
  .description('Update selected calendar'.cyan)
  .option('--summary <summary>', 'Headline of updated calendar (required)')
  .option('--description [description]', 'Description of updated calendar')
  .option('--timezone [timezone]', 'Timezone of updated calendar (IANA tz format)')
  .option('--location [location]', 'Location of updated calendar')
  .action((options) => {
    try {
      updateSelectedCalendar({
        id: null,
        summary: options.summary,
        description: options.description,
        timezone: options.timezone,
        location: options.location
      });
    }
    catch (err) {
      process.exit(1);
    }
  });

// Delete calendar
cli
  .command('delete-calendar')
  .description('Delete selected calendar'.cyan)
  .action(() => {
    try {
      deleteSelectedCalendar();
    }
    catch (err) {
      process.exit(1);
    }
  });

cli.parse(process.argv);
