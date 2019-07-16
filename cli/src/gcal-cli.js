//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file src/index.js
// 
//  @description Main src file for CLI tool
//  ---------------------------------------------------------

'use strict'

// Third party modules
const cli = require('commander');
require('colors');

// CLI modules
const { version } = require('../package.json');
const authenticate = require('./auth');

// CLI init
cli
  .version(version, '-v, --version');

// Auth commands
cli
  .command('auth')
  .description('Authenticate Google Account\n')
  .action(() => authenticate());

cli.parse(process.argv);