//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file src/auth.js
// 
//  @description Make HTTP call to wrapper server to obtain
//  OAuth information regarding Google Account 
//  ---------------------------------------------------------

'use strict'

// Third party module
const path = require('path');
const fs = require('fs');
const express = require('express');
const ora = require('ora');

// CLI modules
const HTTP = require('../utils/http');
const { executeCmd } = require('../utils/console');

// File paths
const authPath = path.resolve(__dirname);
const tokensPath = path.resolve(__dirname, '.access_tokens.json');

// Configure new axios instance
const http = new HTTP();
http.setBaseURL('http://localhost:8000');

async function authenticate() {
  try {
    // Starts a mock server that will listen to the redirect URL with the authentication code
    // After the code is obtained from query string, mock server will be closed
    // A GET request to the wrapper API will be called subsequently to obtain authorization code
    startMockServer();

    const { data } = await http.get('/api/auth/oauthUrl');
    // open browser for oauth
    const openBrowser = executeCmd(`open "${data.url.toString()}"`, authPath);

    if (openBrowser) {
      console.log('If browser does not pop up, navigate to the following site for authentication:\n'.yellow);
      console.log(data.url.toString())
    }
  }
  catch (err) {
    console.log(err.message)
    console.log("Failed to authenticate to Google account. Try again!".red);
    process.exit(1);
  }
}

// Starts a mock server that will listen to the redirect URL with the authentication code
function startMockServer() {
  const app = express();

  // Listen to port 3000 for code to exchange for access token
  const server = app.listen(3000, () => {
    app.get('/oauth/callback', (req, res) => {

      http
        .get(`/api/auth/validateToken?code=${req.query.code}`)
        .then(data => {
          // If token is validated, store access tokens locally  
          fs.writeFileSync(tokensPath, JSON.stringify(data.data.token), 'utf-8');

          console.log('Google Account authenticated'.green);
          res.send('Exchanged code for authorization token.. This tab can be closed now.');
          server.close();
        })
        .catch(err => {
          // Rejects invalid token
          console.error('Error: Invalid code. Try again!'.bgRed);
          res.send(`${err.message}`);
          server.close();
        });
    });
  });
}

module.exports = authenticate;

