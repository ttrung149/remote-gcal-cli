//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file schemas/auth-schemas.js
// 
//  @description Contains schemas for auth body request
//  These schemas are used for data validation before forwarding
//  requests to Google API
//  ---------------------------------------------------------

'use strict';

// Third party modules
const Joi = require('@hapi/joi');

const accessCodeSchema = Joi.object().keys({
  code: Joi.string().min(1).required()
});

const accessTokenSchema = Joi.object().keys({
  access_token: Joi.string().min(1).required()
});

const refreshTokenSchema = Joi.object().keys({
  refresh_token: Joi.string().min(1).required()
});

module.exports = {
  accessCodeSchema,
  accessTokenSchema,
  refreshTokenSchema
};
