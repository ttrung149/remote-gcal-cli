//  ---------------------------------------------------------
//  remote-gcal-cli
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/console.js
// 
//  @description Terminal/console utils
//  ---------------------------------------------------------

'use strict'

// Third party modules
const child_process = require('child_process');

function executeCmd(cmd, dir) {
  try {
    child_process.execSync(cmd, { cwd: dir });
  }
  catch (err) {
    return {
      error: true,
      message: err.message
    }
  }
}

module.exports = {
  executeCmd
};