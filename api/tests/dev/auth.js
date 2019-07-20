//  ---------------------------------------------------------
//  gcal-wrapper-api
//  ---------------------------------------------------------
//  @copyright MIT License. Copyright (c) 2019 - Trung Truong
//  
//  @file test/dev/auth.js  
// 
//  @description This file is used to test auth routes for wrapper
//  API. 
//
//  IMPORTANT: PLEASE GO TO .credentials.json and read 
//  the header for instructions before running the test.
//  ---------------------------------------------------------

/* eslint-disable */
'use strict'

// Third party modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// API modules
const server = require('../../app');

const should = chai.should();
chai.use(chaiHttp);

describe('Test gcal-wrapper-api AUTH routes', () => {

  // Before testing the routes, make sure .credentials.js exists
  before((done) => {
    try {
      const pathToCredentials = path.resolve(__dirname, '..', '.credentials.js');
      fs.readFileSync(pathToCredentials, 'utf-8');
      done();
    }
    catch (err) {
      done('.credentials.js does not exist! Please read the header for more instruction');
    }
  });

  // Test GET /oauthUrl route
  describe('GET /oauthUrl', () => {
    const { googleOauthAuthURL } = require('../../utils/google-api');
    it('POSITIVE: should return authUrl to CLI', (done) => {
      chai
        .request(server)
        .get('/api/auth/oauthUrl')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.url.should.be.eql(googleOauthAuthURL);
          done();
        });
    });
  }, 2000);

  // Test GET /getAuthTokenFromCode route
  describe('GET /getAuthTokenFromCode', () => {
    const { code, access_token } = require('../.credentials.js');

    // @todo: positive test needs refactoring because the code provided are
    // from Google Oauth playground which has different client ID and client secret,
    // therefore the code sent does not return correct decrypted access token

    // Positive: Should return expected access token from
    // provided authorization code
    xit('POSITIVE: should return correct access token', (done) => {
      chai
        .request(server)
        .get(`/api/auth/getAuthTokenFromCode?code=${code}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.token.should.be.eql(access_token);
          res.body.message.should.be.eql('Google account authenticated successfully');
          done();
        });
    });

    // Negative: Should rejects if authorization code is invalid
    for (let i = 0; i < 5; i++) {
      it(`NEGATIVE: should rejects if authorization code is invalid #${i + 1}`, (done) => {
        const buf = Buffer.alloc(10);
        const code = crypto.randomFillSync(buf).toString('hex');
        chai
          .request(server)
          .get(`/api/auth/getAuthTokenFromCode?code=${code}`)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.message.should.be.eql('Failed to authenticate Google account');
            done();
          });
      });
    }
  }, 2000);

  // Test GET /isTokenValid route
  describe('GET /isTokenValid', () => {
    const { access_token } = require('../.credentials.js');

    // Positive: Should return valid when token is valid
    it('POSITIVE: should return valid when access token is valid', (done) => {
      chai
        .request(server)
        .get(`/api/auth/isTokenValid?access_token=${access_token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql('valid_token');
          done();
        });
    });

    // Negative: Should rejects if authorization code is invalid
    for (let i = 0; i < 5; i++) {
      it(`NEGATIVE: should return invalid if token is invalid #${i + 1}`, (done) => {
        const buf = Buffer.alloc(20);
        const access_token = crypto.randomFillSync(buf).toString('hex');
        chai
          .request(server)
          .get(`/api/auth/isTokenValid?access_token=${access_token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql('invalid_token');
            done();
          });
      });
    }
  }, 2000);

  // Test GET /refreshToken route
  describe('GET /refreshToken', () => {
    const { refresh_token } = require('../.credentials.js');

    // @todo: positive test needs refactoring because the code provided are
    // from Google Oauth playground which has different client ID and client secret,
    // therefore the refresh token sent does not return correct decrypted access token

    // Positive: Should return valid access token when provided with valid refresh token
    xit('POSITIVE: should return valid access token when provided with valid refresh token', (done) => {
      chai
        .request(server)
        .get(`/api/auth/refreshToken?refresh_token=${refresh_token}`)
        .end((err, res) => {
          chai
            .request(server)
            .get(`/api/auth/isTokenValid?access_token=${res.data.data}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.eql('valid_token');
              done();
            });
        });
    });

    // Negative: Should rejects if refresh token is invalid
    for (let i = 0; i < 5; i++) {
      it(`NEGATIVE: should return invalid if token is invalid #${i + 1}`, (done) => {
        const buf = Buffer.alloc(20);
        const refresh_token = crypto.randomFillSync(buf).toString('hex');
        chai
          .request(server)
          .get(`/api/auth/refreshToken?refresh_token=${refresh_token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.eql('invalid_refresh_token');
            done();
          });
      });
    }
  }, 2000);
});
