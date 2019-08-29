//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file app.js  
// 
//  @description Root file that starts the Google Calendar 
//  API wrapper server. To start the local dev server, 
//  run `npm run setup && npm run start-dev`
//  ---------------------------------------------------------

'use strict';

const http = require('http');
const https = require('https');

const app = require('./app');

const port = process.env.PORT || 8000;

// Create a server with provided app from app.js
const server = http.createServer(app);

// Server listening at port env variable or 8000
server.listen(port, () => {
  // In production, prevent idling by pinging the 
  // api once every 30 minutes
  if (process.env.NODE_ENV === 'production') {
    try {
      setInterval(() => {
        https.get('https://gcal-wrapper-api.herokuapp.com/');
      }, (1800000));
    }
    catch (err) { }
  }
});
