//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/google-calendar-routes.js
// 
//  @description Shorten routes for Google Calendar API
//  ---------------------------------------------------------

'use strict';

module.exports = {
  baseUrl: 'https://www.googleapis.com/calendar/v3/',
  calendar: {
    list: 'users/me/calendarList',
    create: 'calendars',
    put: 'calendars',
    delete: 'calendars'
  },
  event: {
    list: 'calendars',
    create: 'calendars',
    put: 'calendars',
    delete: 'calendars'
  },
  settings: 'users/me/settings'
};
