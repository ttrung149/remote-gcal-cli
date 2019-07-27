//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//
//  @file utils/console.js
//
//  @description Terminal/console utils
//  ---------------------------------------------------------

'use strict';

// Third party modules
const childProcess = require('child_process');
const keytar = require('keytar');

// base Urls
const localBaseUrl = 'http://localhost:8000';
const prodBaseUrl = 'https://gcal-wrapper-api.herokuapp.com';

// Execute bash command in node
function executeCmd(cmd, dir) {
  try {
    childProcess.execSync(cmd, { cwd: dir });
  } catch (err) {
    return {
      error: true,
      message: err.message
    };
  }
}

// Safely require a config file
function requireConfig(dir) {
  try {
    const config = require(dir);
    return config;
  } catch (err) {
    console.log('Please checkout a calendar before proceeding!'.yellow);
    process.exit(1);
  }
}

// Keychain storage for access tokens and refresh tokens
// Returns a promise
function setTokenToKeyChain(key, value) {
  return keytar.setPassword('remote-gcal-cli', key, value);
}

function getTokenFromKeyChain(key) {
  return keytar.getPassword('remote-gcal-cli', key);
}

function removeTokenFromKeyChain(key) {
  return keytar.deletePassword('remote-gcal-cli', key);
}

module.exports = {
  localBaseUrl,
  prodBaseUrl,
  executeCmd,
  requireConfig,
  setTokenToKeyChain,
  getTokenFromKeyChain,
  removeTokenFromKeyChain
};
