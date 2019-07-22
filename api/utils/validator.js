//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/validator.js
// 
//  @description Contains utils that perform server-side
//  validation
//  ---------------------------------------------------------

'use strict';

function getValidatedAuthHeader(req) {
  if (req.get('Authorization') !== undefined && req.get('Authorization').length > 2) {
    return req.get('Authorization').split(' ')[1];
  }
  return null;
}

module.exports = {
  getValidatedAuthHeader
};
