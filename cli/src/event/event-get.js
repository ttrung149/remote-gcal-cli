//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file event/event-get.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- event GET end routes
//  ---------------------------------------------------------

'use strict';

// Third party modules
const path = require('path');
const colors = require('colors');

// CLI modules
const HTTP = require('../../utils/http');
const {
  requireConfig,
  getTokenFromKeyChain
} = require('../../utils/cli-utils');

const gcalroutes = require('../../utils/google-api-routes');

const http = new HTTP();
http.setBaseURL(gcalroutes.baseUrl);

/**
 * @description get list of events
 */
async function getListOfEvents(options) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    const currentCalendar = requireConfig(path.resolve(__dirname, '..', '..', '.config', '.currentCalendar.json'));
    console.log(colors.cyan.underline(currentCalendar.summary));
    console.log('');

    const constraints = {};
    // default time values for querying (now to 24:00 today)
    if (!options.timeMin) {
      const now = new Date();
      constraints.timeMin = now.toISOString();
    }
    else {
      constraints.timeMin = new Date(options.timeMin).toISOString();
    }

    if (!options.timeMax) {
      const endOfDay = new Date();
      endOfDay.setHours(24, 0, 0, 0);
      constraints.timeMax = endOfDay.toISOString();
    }
    else {
      constraints.timeMax = new Date(options.timeMax).toISOString();
    }

    // default maximum number of value returned is 20
    if (!options.maxResults || options.maxResults > 20) {
      if (options.maxResults > 20) {
        console.log('WARNING: Querying more than 20 events. Only the first 20 events are displayed!'.yellow);
      }
      constraints.maxResults = 20;
    } else {
      constraints.maxResults = options.maxResults;
    }

    // id of checked out calendar
    const { id } = currentCalendar;
    const querystring = `events?maxResults=${constraints.maxResults}&timeMin=${constraints.timeMin}&timeMax=${constraints.timeMax}&singleEvents=true&orderBy=startTime`;

    http.setAuthorizationHeader('get', accessToken);
    const { data } = await http.get(`${gcalroutes.event.list}/${id}/${querystring}`);

    // no event found
    if (data.items.length === 0) {
      console.log('No events found');
      process.exit(0);
    }

    // print out events to the console
    data.items.forEach((event, index) => {
      const summary = event.summary;
      let description = 'Description not specified';
      let location = 'Location not specified';
      if (event.description) {
        if (event.description.length > 50) {
          description = `${event.description.substring(0, 50)}...`;
        }
        else {
          description = event.description;
        }
      }
      if (event.location) {
        if (event.location.length > 50) {
          location = `${event.location.substring(0, 50)}...`;
        }
        else {
          location = event.location;
        }
      }
      const from = new Date(event.start.dateTime || event.start.date).toLocaleString();
      const to = new Date(event.end.dateTime || event.end.date).toLocaleString();

      console.log(`${index + 1}. `, `${summary}`.blue.bold, `- ${description}`.dim);
      console.log(`${from} -- ${to}`);
      console.log(`@ ${location}`.green);
      console.log('');
    });

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

module.exports = {
  getListOfEvents
};
