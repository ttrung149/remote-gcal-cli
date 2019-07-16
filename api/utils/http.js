//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/http.js
// 
//  @description Configuration for axios to make HTTP calls
//  ---------------------------------------------------------

'use strict';

// Third party modules
const axios = require('axios');

// API modules
const gcalroutes = require('./google-calendar-routes');

class HTTP {
  constructor() {
    this.baseURL = gcalroutes.baseUrl;
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 2000 // default timeout is 2000ms
    });
  }

  // call GET Request
  get(url) {
    return this.http.get(url);
  }

  // call POST Request
  post(url, data) {
    return this.http.post(url, data);
  }

  // set singular HTTP header
  setHttpHeader(method, key, value) {
    this.http.defaults.headers[method][key] = value;
  }

  // set multiple HTTP headers by passing in JSON object
  setHttpHeaderFromJSON(method, header) {
    this.http.defaults.headers[method] = header;
  }

  setAuthorizationHeader(method, token) {
    this.http.defaults.headers[method].Authorization = `Bearer ${token}`;
  }

  setRequestTimeout(time) {
    this.http.defaults.timeout = time;
  }

  setBaseURL(url) {
    this.http.defaults.baseURL = url;
  }
}

module.exports = HTTP;
