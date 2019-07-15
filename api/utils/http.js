//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file utils/http.js
// 
//  @description Configuration for axios to make HTTP calls
//  ---------------------------------------------------------

'use strict'

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

  // sets header if any, call GET Request
  get(url, header) {
    if (header) {
      for (let key in header) {
        this.http.defaults.headers.get[key] = header[key];
      }
    }
    return this.http.get(url);
  }

  // sets header if any, call POST Request
  post(url, header, data) {
    if (header) {
      for (let key in header) {
        this.http.defaults.headers.post[key] = header[key];
      }
    }
    return this.http.post(url, data);
  }

  setHttpHeader(method, header) {
    this.http.defaults.headers[method] = header;
  }

  setAuthorizationHeader(method, token) {
    this.http.defaults.headers[method].Authorization = `Bearer ${token}`;
  }
  setRequestTimeout(time) {
    this.http.defaults.timeout = time;
  }
}

module.exports = HTTP;