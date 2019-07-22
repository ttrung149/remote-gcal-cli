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
      timeout: 5000 // default timeout is 5000ms
    });
  }

  /**
   * @description call GET request
   * @param {string} url 
   */
  get(url) {
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .then(data => resolve(data))
        .catch(err => reject(new Error(err.message)));
    });
  }

  /**
   * @description call POST request
   * @param {string} url 
   * @param {Object} data
   */
  post(url, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(url, data)
        .then(data => resolve(data))
        .catch(err => reject(new Error(err.message)));
    });
  }

  /**
   * @description call PUT request
   * @param {string} url 
   * @param {Object} data
   */
  put(url, data) {
    return new Promise((resolve, reject) => {
      this.http
        .put(url, data)
        .then(data => resolve(data))
        .catch(err => reject(new Error(err.message)));
    });
  }

  /**
  * @description call DELETE request
  * @param {string} url 
  * @param {Object} data
  */
  delete(url, data) {
    return new Promise((resolve, reject) => {
      this.http
        .delete(url, data)
        .then(data => resolve(data))
        .catch(err => reject(new Error(err.message)));
    });
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
