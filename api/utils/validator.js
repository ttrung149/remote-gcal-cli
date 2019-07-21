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

// Third party modules
const Joi = require('@hapi/joi');

function getValidatedAuthHeader(req) {
  if (req.get('Authorization') !== undefined && req.get('Authorization').length > 2) {
    return req.get('Authorization').split(' ')[1];
  }
  return null;
}

// Schema for calendar object
const calendarSchema = Joi.object().keys({
  summary: Joi.string().min(1).required(),
  description: Joi.string().min(1),
  timezone: Joi.string().min(1),
  location: Joi.string().min(1)
});

module.exports = {
  getValidatedAuthHeader,
  calendarSchema
};
