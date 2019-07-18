//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/messages.js
// 
//  @description Functions to improve readability of responds
//  messages
//  ---------------------------------------------------------

'use strict';

function send400Error(res, message) {
  return res.status(400).json(message);
}

function send401Error(res, message) {
  return res.status(401).json(message);
}

function send403Error(res, message) {
  return res.status(403).json({
    message: message
  });
}

function send200Respond(res, message) {
  return res.status(200).json(message);
}

module.exports = {
  send400Error,
  send401Error,
  send403Error,
  send200Respond
};
