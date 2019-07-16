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
require('colors');

// CLI modules
const { version } = require('../package.json');
const { authenticate, logout } = require('./auth');

// CLI init
cli
  .version(version, '-v, --version');

// Auth commands
cli
  .command('auth')
  .description('Grant CLI access to Google Account')
  .option('--logout', 'Delete Google credentials for CLI tool')
  .action((option) => {
    if (option.logout) {
      logout();
    }
    else {
      authenticate();
    }
  });

cli.parse(process.argv);
