//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file event/event-put.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- event PUT end routes
//  ---------------------------------------------------------

'use strict';

// Third party modules
const path = require('path');
const cliSelect = require('cli-select');

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
 * @description update event
 * @param {Object} event
 */
async function updateEvent(event) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    if (!event.start || !event.end) {
      throw new Error('Event start and end attributes are required for querying');
    }

    const currentCalendar = requireConfig(path.resolve(__dirname, '..', '..', '.config', '.currentCalendar.json'));
    // id of checked out calendar
    const currentCalendarId = currentCalendar.id;

    // Get list of events within the time frame specified by start and end
    const queryEventStart = new Date(event.start);
    const queryEventEnd = new Date(event.end);

    console.log(`Fetching first 20 events from in calendar "${currentCalendar.summary}"`.cyan.underline);
    console.log(`${queryEventStart.toLocaleString()} -- ${queryEventEnd.toLocaleString()}...\n`.dim);
    const querystring = `events?maxResults=20&timeMin=${queryEventStart.toISOString()}&timeMax=${queryEventEnd.toISOString()}&singleEvents=true&orderBy=startTime`;

    http.setAuthorizationHeader('get', accessToken);
    const eventList = await http.get(`${gcalroutes.event.list}/${currentCalendarId}/${querystring}`);

    console.log('Select event'.cyan);
    // no event found
    if (eventList.data.items.length === 0) {
      console.log('No events found');
      process.exit(0);
    }

    // Prompt selection for fetched events within specified time range
    const selection = await cliSelect({
      values: eventList.data.items.map(event => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        return `${event.summary}: ` + `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`.dim;
      }),
      selected: '◎'.green,
      unselected: '○'
    });
    console.log(`Updating: ${selection.value}...`);
    const eventId = eventList.data.items[selection.id].id;

    // setup the payload for PUT request
    const payload = {};
    if (!event.from || !event.to) {
      throw new Error('From and to attributes are required');
    }
    payload.start = {
      dateTime: new Date(event.from).toISOString()
    };
    payload.end = {
      dateTime: new Date(event.to).toISOString()
    };
    const eventColors = require(path.resolve(__dirname, '..', '..', '.config', '.eventColors.json'));
    if (event.color && !eventColors[event.color]) {
      throw new Error('Color does not exist. Run `gcal-cli create-event --help` to see available colors');
    }
    else {
      payload.colorId = eventColors[event.color];
    }

    if (event.summary) payload.summary = event.summary;
    if (event.description) payload.description = event.description;
    if (event.location) payload.location = event.location;

    // send PUT request with payload
    http.setAuthorizationHeader('put', accessToken);
    await http.put(`${gcalroutes.event.put}/${currentCalendarId}/events/${eventId}`, payload);
    console.log(`Event was updated successfully in "${currentCalendar.summary}"!`.green);

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
    console.log('Failed to update exisiting event. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  updateEvent
};
