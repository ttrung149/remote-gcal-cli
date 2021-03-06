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

'use strict';

// Third party module
const path = require('path');
const express = require('express');
const noCache = require('nocache');
const ora = require('ora');

// CLI modules
const HTTP = require('../utils/http');
const {
  prodBaseUrl,
  executeCmd,
  setTokenToKeyChain,
  getTokenFromKeyChain,
  removeTokenFromKeyChain
} = require('../utils/cli-utils');
const {
  baseUrl,
  settings
} = require('../utils/google-api-routes');

// File paths
const authPath = path.resolve(__dirname);

// Configure new axios instance
const http = new HTTP();
http.setBaseURL(prodBaseUrl);
http.setRequestTimeout(8000);

async function authenticate() {
  try {
    const accessToken = await getTokenFromKeyChain('access_token');
    const refreshToken = await getTokenFromKeyChain('refresh_token');

    // First time authenticating, token is not stored
    if (!accessToken || !refreshToken) {
      // Starts a mock server that will listen to the redirect URL with the authentication code
      // After the code is obtained from query string, mock server will be closed
      // A GET request to the wrapper API will be called subsequently to obtain authorization code
      startMockServer();

      const { data } = await http.get('/api/auth/oauthUrl');
      // open browser for oauth
      const openBrowser = executeCmd(`open "${data.url.toString()}"`, authPath);

      if (openBrowser) {
        console.log('If browser does not pop up, navigate to the following site for authentication:'.yellow);
        console.log(data.url.toString());
      }
    }
    else {
      // If access token is stored, check if access token is valid
      // @refactor: remove double hop to proxy server then to Google API
      // by calling Google Calendar API directly
      const calendarHTTP = new HTTP();
      calendarHTTP.setBaseURL(baseUrl);
      calendarHTTP.setAuthorizationHeader('get', accessToken);

      await calendarHTTP.get(settings);
      console.log('Google Account has already been authenticated'.green);
    }
  }
  catch (err) {
    // Refresh access token if invalid
    if (err.response) {
      if (err.response.status === 401) {
        console.log('Invalid access token. Attempting to refresh token..'.yellow);
        const spinner = ora('Authenticating..').start();

        const refreshToken = await getTokenFromKeyChain('refresh_token');
        const newAccessTokenData = await http.post('/api/auth/refreshToken', {
          refresh_token: refreshToken
        });

        // If refresh token is invalid, throw Error, delete stored tokens
        if (newAccessTokenData.data === 'invalid_refresh_token') {
          await removeTokenFromKeyChain('access_token');
          await removeTokenFromKeyChain('refresh_token');
          console.log('\nRefresh token expired. Please run `gcal-cli auth` again!'.red);
          spinner.stop();
          process.exit(1);
        }
        else {
          await setTokenToKeyChain('access_token', newAccessTokenData.data.data.access_token);
          console.log('\nGoogle Account authenticated'.green);
          spinner.stop();
          process.exit(0);
        }
      }
    }
    else {
      console.log(err.message);
    }
    console.log('Failed to authenticate to Google account. Try again!'.bgRed);
    process.exit(1);
  }
}

// Logout function: delete credentials store in keychain
async function logout() {
  try {
    const spinner = ora('Logging Out..').start();
    await removeTokenFromKeyChain('access_token');
    await removeTokenFromKeyChain('refresh_token');

    spinner.stop();
    console.log('Logout successfully'.green);
  }
  catch (err) {
    console.log('Failed to logout. Try again!'.bgRed);
    process.exit(1);
  }
};

// Starts a mock server that will listen to the redirect URL with the authentication code
function startMockServer() {
  const app = express();
  app.use(noCache());

  // Listen to port 3000 for code to exchange for access token
  const server = app.listen(3000, () => {
    app.get('/oauth/callback', async (req, res) => {
      try {
        const { data } = await http.post('/api/auth/getAuthTokenFromCode', {
          code: req.query.code
        });
        const spinner = ora('Authenticating..').start();

        await setTokenToKeyChain('access_token', data.token.access_token);

        if (data.token.refresh_token) {
          await setTokenToKeyChain('refresh_token', data.token.refresh_token);
        }

        res.send('Exchanged code for authorization token.. This tab can be closed now..');
        server.close(() => {
          console.log('\nGoogle account is authenticated'.green);
          spinner.stop();
        });
      }
      catch (err) {
        console.log(err.message);
        console.log('Failed to authenticate to Google account. Try again!'.bgRed);
        res.send(`${err.message}`);
        server.close();
      }
    });
  });
}

module.exports = {
  authenticate,
  logout
};
