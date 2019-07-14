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

'use strict'

const http = require('http');
const app = require('./app');

const port = process.env.INDEX_PORT || 3000;

// Create a server with provided app from app.js
const server = http.createServer(app);

//Server listening at port env variable or 3000
server.listen(port);