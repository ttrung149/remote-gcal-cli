//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file event/event-post.js  
// 
//  @description Controller for retrieving data from Google Calendar
//  API -- event POST end routes
//  ---------------------------------------------------------

'use strict';

// Third party modules
const path = require('path');

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
 * @description create new event
 * @param {Object} event
 */
async function createNewEvent(event) {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    if (!accessToken) {
      throw new Error('No access token was found. Please run `gcal-cli auth` to authenticate');
    }

    // setup the payload for POST request
    const payload = {};
    if (!event.summary || !event.from || !event.to) {
      throw new Error('Summary, from, and to attributes are required');
    }
    payload.summary = event.summary;
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
    else if (!event.color) {
      payload.colorID = 1;
    }
    else {
      payload.colorId = eventColors[event.color];
    }
    payload.description = event.description || 'Description not specified';
    payload.location = event.location || 'Location not specified';

    const currentCalendar = requireConfig(path.resolve(__dirname, '..', '..', '.config', '.currentCalendar.json'));

    http.setAuthorizationHeader('post', accessToken);
    await http.post(`${gcalroutes.event.create}/${currentCalendar.id}/events`, payload);
    console.log(`Event was created successfully in "${currentCalendar.summary}"!`.green);
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
    console.log('Failed to create new event. Try again!'.bgRed);
    process.exit(1);
  }
}

module.exports = {
  createNewEvent
};
