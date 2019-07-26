//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  DEPRECATED
//
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file schemas/calendar-schemas.js
// 
//  @description Contains schemas for calendar body request
//  These schemas are used for data validation before forwarding
//  requests to Google API
//  ---------------------------------------------------------

'use strict';

// Third party modules
const Joi = require('@hapi/joi');

// Schema for calendar object
const createCalendarSchema = Joi.object().keys({
  summary: Joi.string().min(1).required(),
  description: Joi.string().min(1),
  timeZone: Joi.string().min(1),
  location: Joi.string().min(1)
});

const updateCalendarSchema = Joi.object().keys({
  id: Joi.string().required(),
  summary: Joi.string().min(1),
  description: Joi.string().min(1),
  timeZone: Joi.string().min(1),
  location: Joi.string().min(1)
});

const deleteCalendarSchema = Joi.object().keys({
  id: Joi.string().required()
});

module.exports = {
  createCalendarSchema,
  updateCalendarSchema,
  deleteCalendarSchema
};
