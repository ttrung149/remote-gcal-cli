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
const colors = require('colors');

// CLI modules
const { version } = require('./package.json');
const { authenticate, logout } = require('./src/auth');

// Calendar controllers
const { checkOutCalendar, getListOfCalendars } = require('./src/calendar/calendar-get');
const { createNewCalendar } = require('./src/calendar/calendar-post');
const { updateSelectedCalendar } = require('./src/calendar/calendar-put');
const { deleteSelectedCalendar } = require('./src/calendar/calendar-delete');

// Event controllers
const { getListOfEvents } = require('./src/event/event-get');
const { createNewEvent } = require('./src/event/event-post');
const { updateEvent } = require('./src/event/event-put');
const { deleteExistingEvent } = require('./src/event/event-delete');

// CLI init
cli
  .version(version, '-v, --version')
  .on('--help', () => {
    console.log('');
    console.log('Instructions:');
    console.log('  Please go to `gcal-cli <command> --help` for more instruction on each command');
    console.log('');
  });

// Auth commands
cli
  .command('auth')
  .description('Grant CLI access to Google Account'.green)
  .option('--logout', 'Delete Google credentials for CLI tool'.yellow)
  .action(async (option) => {
    try {
      if (option.logout) await logout();
      else await authenticate();
    }
    catch (err) {
      console.log(`\nError: ${err.message}`);
      console.log('Please try to run `gcal-cli auth` again!'.bgRed);
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

/** Event commands */
// Get list of events
cli
  .command('get-events')
  .description('Get events from checked-out calendar'.blue)
  .option('--from [datetime]', 'Get events from (MM-DD-YYYY HH:MM)')
  .option('--to [datetime]', 'Get events to (MM-DD-YYYY HH:MM)')
  .option('--max-results [num]', 'Return specfied number of events')
  .action((options) => {
    try {
      getListOfEvents({
        timeMin: options.from,
        timeMax: options.to,
        maxResults: options.maxResults
      });
    }
    catch (err) {
      console.log(colors.red(err.message));
      process.exit(1);
    }
  })
  .on('--help', function () {
    console.log('');
    console.log('Make sure to checkout a valid calendar before getting events'.yellow.underline);
    console.log('');
    console.log('Default values:'.cyan);
    console.log('');
    console.log('   --from: datetime at the moment (24 Hours time)');
    console.log('   --to: datetime at the end of today (24 Hours time)');
    console.log('   --max-result: 20');
    console.log('');
  });

// Create new event
cli
  .command('create-event')
  .description('Insert new event to checked-out calendar'.blue)
  .option('--summary <summary>', 'Headline of created event')
  .option('--from <datetime>', 'Start of event (MM-DD-YYYY HH:MM)')
  .option('--to <datetime>', 'End of event (MM-DD-YYYY HH:MM)')
  .option('--color [color]', 'Select color in color list for event')
  .option('--description [description]', 'Description of event')
  .option('--location [location]', 'Location of event')
  .action(async (options) => {
    try {
      await createNewEvent({
        summary: options.summary,
        from: options.from,
        to: options.to,
        color: options.color,
        description: options.description,
        location: options.location
      });
    }
    catch (err) {
      console.log(colors.red(err.message));
      process.exit(1);
    }
  })
  .on('--help', function () {
    console.log('');
    console.log('Make sure to checkout a valid calendar before getting events'.yellow.underline);
    console.log('');
    console.log('Required parameters: --summary, --from, --to'.bold);
    console.log('');
    console.log('Default values:'.cyan);
    console.log('');
    console.log('   All time are 24 Hours time');
    console.log('');
    console.log('   --colors: available colors include:');
    console.log('   sky, mint, purple, pink, yellow, orange');
    console.log('   turquoise, grey, blue, green, red');
    console.log('');
  });

// Update an existing event
cli
  .command('update-event')
  .description('Update existing event to checked-out calendar'.blue)
  .option('--start <datetime>', 'Start of event (MM-DD-YYYY HH:MM)')
  .option('--end <datetime>', 'End of event (MM-DD-YYYY HH:MM)')
  .option('--from <datetime>', 'Updated start of event (MM-DD-YYYY HH:MM)')
  .option('--to <datetime>', 'Updated end of event (MM-DD-YYYY HH:MM)')
  .option('--summary [summary]', 'Updated headline of created event')
  .option('--color [color]', 'Updated color in color list for event')
  .option('--description [description]', 'Updated description of event')
  .option('--location [location]', 'Updated location of event')
  .action(async (options) => {
    try {
      await updateEvent({
        start: options.start,
        end: options.end,
        from: options.from,
        to: options.to,
        summary: options.summary,
        color: options.color,
        description: options.description,
        location: options.location
      });
    }
    catch (err) {
      console.log(colors.red(err.message));
      process.exit(1);
    }
  })
  .on('--help', function () {
    console.log('');
    console.log('Make sure to checkout a valid calendar before getting events'.yellow.underline);
    console.log('');
    console.log('Required parameters: --start, --end, --from, --to'.bold);
    console.log('');
    console.log('Default values:'.cyan);
    console.log('');
    console.log('   All time are 24 Hours time');
    console.log('');
    console.log('   --colors: available colors include:');
    console.log('   sky, mint, purple, pink, yellow, orange');
    console.log('   turquoise, grey, blue, green, red');
    console.log('');
  });

// Delete existing event
cli
  .command('delete-event')
  .description('Delete selected event'.blue)
  .option('--start <datetime>', 'Start of event (MM-DD-YYYY HH:MM)')
  .option('--end <datetime>', 'End of event (MM-DD-YYYY HH:MM)')
  .action(async (options) => {
    try {
      await deleteExistingEvent({
        start: options.start,
        end: options.end
      });
    }
    catch (err) {
      console.log(colors.red(err.message));
      process.exit(1);
    }
  })
  .on('--help', function () {
    console.log('');
    console.log('Make sure to checkout a valid calendar before getting events'.yellow.underline);
    console.log('');
    console.log('Required parameters: --start, --end'.bold);
    console.log('');
  });

cli.parse(process.argv);
